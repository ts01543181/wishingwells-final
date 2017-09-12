import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Button } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import axios from 'axios'
import DonationConfirmModal from './DonationConfirmModal.js'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import { Actions } from 'react-native-router-flux'
import { HOST_IP } from '../../../config.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    qr: state.ProfileReducer.donationID,
    cardID: state.ProfileReducer.cardID,
    receiverTotal: 0,
    receiverEmail: '',
    donateReady: false,
  }
}

class DonationWell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      coinSpeed: 20,
      paymentReady: false
    }
    this.donate = this.donate.bind(this);
    this.toggleDonateReady = this.toggleDonateReady.bind(this);
  }

  componentDidMount() {
    db.ref(`users/${this.props.qr}`).once('value', (user) => {
      this.setState({
        receiverEmail: user.val().email
      })
    })
  }

  toggleDonateReady() {
    this.setState({
      donateReady: true,
    })
  }

  donate() {

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
            }) // TAKE OUT THIS BRACKET
            //
            //   let buyObj = {
            //     walletAddress: this.props.qr,
            //     uid: this.props.qr,
            //     amount: Number(this.state.amount),
            //   }
            //
            //   axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
            //   .then(({data}) => {
            //     console.log(data)
            //
            //     let fees = (Number(data.total.amount) - Number(data.subtotal.amount)) + 0.3 + (0.03 * Number(this.state.amount));
            //     let feesObj = {
            //       walletAddress: this.props.uid,
            //       cardID: this.props.cardID,
            //       amount: fees * 100,
            //     }
            //
            //     axios.post(`http://${HOST_IP}:4000/api/payFees`, feesObj)
            //     .then(() => {
            //       this.setState({
            //         amount: '',
            //         description: '',
            //         donateReady: false,
            //       })
            //
            //       alert('Donation Made')
            //     })
            //   })
            // })

            const investmentLogsRef = db.ref(`users/${this.props.qr}/investmentLogs`)

            investmentLogsRef.push({
              date: new Date().toDateString(),
              time: new Date().getTime(),
              amount: this.state.amount,
              description: this.state.description,
            })

            alert('Donation Made!!!')
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

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
        <View style={styles.walletAmountContainer}>
          <Text style={styles.walletAmount}>Donation to:</Text>
          <Text style={styles.receiverEmail}>{this.state.receiverEmail}</Text>
        </View>
        <View style={styles.inputFields}>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Input Amount</Text>
          </View>
          <TextInput style={styles.amountInputField} placeholder="Amount here" placeholderTextColor={'#A8A8A8'} keyboardType={'numeric'} multiline={true} onChangeText={(text) => this.setState({amount: Number(text)})} value={String(this.state.amount)}/>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Description</Text>
          </View>
          <TextInput placeholder='Description Here' placeholderTextColor={'#A8A8A8'} style={styles.descriptionInputField} multiline={true} numberOfLines={2} onChangeText={(text) => this.setState({description: text})} value={this.state.description}/>
          <View style={styles.confirmModal}>
            <DonationConfirmModal amount={this.state.amount} description={this.state.description} toggleDonateReady={this.toggleDonateReady}/>
          </View>
          <View style={styles.investButtonContainer}>
            <Button style={styles.investButton} title="Donate" onPress={this.donate}/>
          </View>
        </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex:2
  },
  walletAmountContainer: {
    marginTop: '5%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  walletAmount: {
    fontSize: 30,
  },
  receiverEmail: {
    marginTop: 20,
    fontSize: 20
  },
  // coin: {
  //   top: '6%',
  //   height: '55%',
  //   width: '100%',
  // },
  inputFields: {
    marginTop: '2%',
    marginLeft: '25%',
    height: '25%',
    width: '50%',
    borderColor: 'gray',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  credentials: {
    paddingTop: 10
  },
  confirmModal: {
    height: '10%',
    width: 100,
  },
  amountInputField: {
    width: '100%',
    height: '30%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
  descriptionInputField: {
    width: '100%',
    height: '50%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10
  },
  investButtonContainer: {
    marginTop: '60%',
    borderWidth: 1,
    borderRadius: 60,
    borderColor: 'blue',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 70,
  },
  investButton: {
  }
})

// <GestureRecognizer
//   onSwipeUp={(state) => this.onSwipeUp(state)}
//   config={config}
//   style={styles.coin}
//   >
//   <View style={styles.coin}></View>
// </GestureRecognizer>

export default connect(mapStateToProps, { setUserInfo })(DonationWell)
