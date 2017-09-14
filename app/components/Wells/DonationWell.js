import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Button, TouchableWithoutFeedback, Image } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import axios from 'axios'
import DonationConfirmModal from './DonationConfirmModal.js'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import { Actions } from 'react-native-router-flux'
import { HOST_IP } from '../../../config.js'
import Spinner from 'react-native-spinkit'
import * as Animatable from 'react-native-animatable'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Communications from 'react-native-communications'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    qr: state.ProfileReducer.donationID,
    cardID: state.ProfileReducer.cardID,
    receiverTotal: 0,
    receiverEmail: '',
    donateReady: false,
    total: state.ProfileReducer.total
  }
}

class DonationWell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      coinSpeed: 20,
      paymentReady: false,
      phoneNumber: ''
    }
    this.donate = this.donate.bind(this);
    this.toggleDonateReady = this.toggleDonateReady.bind(this);
  }

  componentDidMount() {
    db.ref(`users/${this.props.qr}`).once('value', (user) => {
      this.setState({
        receiverEmail: user.val().email,
        phoneNumber: user.val().phoneNumber
      })
    })
  }

  toggleDonateReady() {
    this.setState({
      donateReady: true,
    })
  }

  donate() {

    Communications.text(this.state.phoneNumber, this.state.description)

    if (Number(this.state.amount) < 5) {
      alert('Donation amount should be more than $5.00')
      return;
    }

    if (this.state.donateReady) {

      if (this.props.uid !== '' && this.props.cardID !== '') {
        let chargeObj = {
          walletAddress: this.props.uid,
          cardID: this.props.cardID,
          amount: Number(this.state.amount) * 100,
        }
        axios.post(`http://${HOST_IP}:4000/api/makeInvestment`, chargeObj)
        .then(({data}) => {
          console.log(data.status)

          if (data.status === 'succeeded') {
            db.ref(`users/${this.props.uid}`).once('value', (user) => {

              db.ref(`users/${this.props.uid}`).update({
                total: user.val().total - (chargeObj.amount / 100)
              })

              let buyObj = {
                walletAddress: this.props.qr,
                uid: this.props.qr,
                amount: Number(this.state.amount),
              }

              axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
              .then(({data}) => {
                console.log(data)

                let fees = (Number(data.total.amount) - Number(data.subtotal.amount)) + 0.3 + (0.03 * Number(this.state.amount));
                let feesObj = {
                  walletAddress: this.props.uid,
                  cardID: this.props.cardID,
                  amount: fees * 100,
                }

                axios.post(`http://${HOST_IP}:4000/api/payFees`, feesObj)
                .then(() => {
                  this.setState({
                    amount: '',
                    description: '',
                    donateReady: false,
                  })

                  alert('Donation Made')
                })
              })
              .catch(err => {
                console.log(err),
                alert("Coinbase buy didn't go through. (You can only cash out up to 3 times per day)")
              })
            })

            const investmentLogsRef = db.ref(`users/${this.props.qr}/investmentLogs`)

            investmentLogsRef.push({
              date: new Date().toDateString(),
              time: new Date().getTime(),
              amount: this.state.amount,
              description: this.state.description,
            })
          } else {
            alert('Donation denied: Please check credit card input')
          }
        })
        .catch(err => {
          console.log(err)
          alert('Error')
        })
      } else {
        alert('Invalid card credentials')
      }
    } else {
      alert('Please confirm donation details')
    }

    // if (this.state.donateReady) {
    //
    //   const ref = db.ref(`users/${this.props.qr}/logs`)
    //
    //   ref.push({
    //     date: new Date().toDateString(),
    //     amount: this.state.amount,
    //     description: this.state.description
    //   })
    //
    //   this.setState({
    //     amount: '',
    //     description: '',
    //   })
    //
    //   let chargeObj = {
    //     walletAddress: this.props.qr,
    //     cardID: this.props.cardID,
    //     amount: Number(this.state.amount),
    //   }
    //
    //   db.ref(`users/${this.props.qr}`).once('value', (user) => {
    //
    //     db.ref(`users/${this.props.qr}`).update({
    //       total: user.val().total + chargeObj.amount
    //     })
    //
    //     this.setState({
    //       donateReady: false
    //     })
    //     alert('Donation made!')
    //   })
    // }
  }

  render() {
    const resizeMode = 'stretch';

    return (
      <View style={styles.bodyWrap}>

      <View style={styles.container}>
        <Image source={require('../../../assets/background2sliced.jpg')} style={{
          flex: 1,
          resizeMode: 'cover',
        }}>
          <View style={styles.walletWrap}>
            <Text style={styles.walletAmount}>${this.props.total.toFixed(2)}</Text>
            <Text style={styles.walletText}>CURRENT WALLET BALANCE</Text>
          </View>
        </Image>
      </View>

        <View>
          <Text style={styles.credentials}>A M O U N T   T O  D O N A T E</Text>
        </View>

        <View style={styles.amountInputField}>
          <Text style={styles.dollarSign}>$</Text>
          <KeyboardAwareScrollView>
          <TextInput style={styles.amountInput} placeholder="0" keyboardType={'numeric'} onChangeText={(text) => this.setState({amount: Number(text)})} value={this.state.amount}/>
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.descriptionInputField}>
          <Text>M E S S A G E : </Text>
          <KeyboardAwareScrollView>
          <TextInput style={styles.descriptionInput} multiline={true} placeholder="Message Here" numberOfLines={2} maxLength={54} onChangeText={(text) => this.setState({description: text})} value={this.state.description}/>
          </KeyboardAwareScrollView>
        </View>

        <GestureRecognizer
           onSwipeUp={(state) => this.donate()}
          style={styles.coin}
        >
           <View style={styles.coin}>
              <Animatable.View ref="view">
                <Spinner type="CircleFlip" size={150} color={'#ffd700'}/>
              </Animatable.View>
           </View>
        </GestureRecognizer>

          <View style={styles.confirmModal}>
            <DonationConfirmModal amount={this.state.amount} toggleDonateReady={this.toggleDonateReady}/>
          </View>
      </View>
    )
  }
  }

  const styles = StyleSheet.create({
  bodyWrap: {
    backgroundColor: 'white',
    height: '100%'
  },
  container: {
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletWrap: {
    paddingTop: '5%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  walletAmount: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 50,
    color: 'white',
    textAlign: 'center',
  },
  walletText: {
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  amountWrap: {
    marginTop: '30%',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  credentials: {
    paddingTop: '5%',
    fontSize: 15,
    textAlign: 'center'
  },
  confirmModal: {
    marginTop: '20%',
  },
  amountInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
  },
  amountInput: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 50,
    width: '35%',
    marginTop: '5%',
  },
  descriptionInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
    marginLeft: '20%'
  },
  dollarSign: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 50,
    marginLeft: '35%'
  },
  descriptionInput: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    width: '60%',
    height: 35
  },
  coin: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%'
  },
  })

  export default connect(mapStateToProps)(DonationWell)
