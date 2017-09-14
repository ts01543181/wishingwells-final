import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Button, TouchableWithoutFeedback, Image } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import axios from 'axios'
import InvestConfirmModal from './InvestConfirmModal.js'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import { setSavings } from '../../Actions/Savings/SavingsAction.js'
import { HOST_IP } from '../../../config.js'
import Spinner from 'react-native-spinkit'
import * as Animatable from 'react-native-animatable'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    cardID: state.ProfileReducer.cardID,
    total: state.ProfileReducer.total,
  }
}

class Invest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      investmentReady: false,
    }
    this.onSwipeUp = this.onSwipeUp.bind(this);
    this.toggleInvestmentReady = this.toggleInvestmentReady.bind(this);
  }

  toggleInvestmentReady() {
    this.setState({
      investmentReady: true,
    })
  }

  onSwipeUp(gestureState) {

    if (Number(this.state.amount) < 5) {
      alert('Investment amount should be more than $5.00')
      return;
    }

    if (this.state.investmentReady) {

      if (this.props.uid !== '' && this.props.cardID !== '') {
        let chargeObj = {
          walletAddress: this.props.uid,
          cardID: this.props.cardID,
          amount: Number(this.state.amount) * 100,
        }

        // // TEST CASING //
        //
        // db.ref(`users/${this.props.uid}`).once('value', (user) => {
        //
          // db.ref(`users/${this.props.uid}`).update({
          //   total: user.val().total - (chargeObj.amount / 100)
          // })
        //
        //
        //   const investmentLogsRef = db.ref(`users/${this.props.uid}/investmentLogs`)
        //
        //   investmentLogsRef.push({
        //     date: new Date().toDateString(),
        //     time: new Date().getTime(),
        //     amount: this.state.amount,
        //     description: 'SELF INVESTMENT'
        //   })
        //
        //   this.refs.view.fadeOutUp(800)
        // })
        //
        // // TEST CASING //

        axios.post(`http://${HOST_IP}:4000/api/makeInvestment`, chargeObj)
        .then(({data}) => {
          console.log(data.status)

          if (data.status === 'succeeded') {
            db.ref(`users/${this.props.uid}`).once('value', (user) => {

              db.ref(`users/${this.props.uid}`).update({
                total: user.val().total - (chargeObj.amount / 100)
              })

              let buyObj = {
                walletAddress: this.props.uid,
                uid: this.props.uid,
                amount: Number(this.state.amount),
              }

              const investmentLogsRef = db.ref(`users/${this.props.uid}/investmentLogs`)

              const ref = db.ref(`users/${this.props.uid}/logs`)

              ref.push({
                date: new Date().toDateString(),
                time: new Date().getTime(),
                amount: '-' + this.state.amount,
                description: 'SELF INVESTMENT'
              })

              investmentLogsRef.push({
                date: new Date().toDateString(),
                time: new Date().getTime(),
                amount: this.state.amount,
                description: 'SELF INVESTMENT'
              })

              this.setState({
                amount: '',
                description: '',
                investmentReady: false,
              })

              axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
              .then(({data}) => {
                console.log(data)

                let fees = (Number(data.total.amount) - Number(data.subtotal.amount)) + 0.3 + (0.03 * Number(this.state.amount));

                let feesObj = {
                  walletAddress: this.props.uid,
                  cardID: this.props.cardID,
                  amount: Number(fees) * 100,
                }

                axios.post(`http://${HOST_IP}:4000/api/makeInvestment`, feesObj)
                .then((data) => {

                  // THIS PART ISN'T GOING THROUGH BECAUSE THE SET STATE ABOVE. WHEN ACTUALLY IMPLEMENTING, PUT SET STATE HERE

                  console.log(data)

                  alert('Investment Made')
                })
                .catch(err => {
                  console.log(err)
                })
              })
              .catch(err => {
                console.log(err)
                alert("Coinbase buy didn't go through")
              })
            })
          } else {
            alert('Investment denied: Please check credit card input')
          }
        })
        .catch(err => {
          console.log(err)
          alert('Error')
        })
      } else {
        alert('Invalid card credentials')
      }
      this.refs.view.fadeOutUp(800)
    } else {
      alert('Please confirm investment details')
    }
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
          <Text style={styles.credentials}>A M O U N T   T O   I N V E S T</Text>
        </View>

        <View style={styles.amountInputField}>
          <Text style={styles.dollarSign}>$  </Text>
          <KeyboardAwareScrollView>
          <TextInput style={styles.amountInput} placeholder="0" keyboardType={'numeric'} onChangeText={(text) => this.setState({amount: Number(text)})} value={this.state.amount}/>
          </KeyboardAwareScrollView>
        </View>

        <GestureRecognizer
           onSwipeUp={(state) => this.onSwipeUp(state)}
          style={styles.coin}
        >
           <View style={styles.coin}>
              <Animatable.View ref="view">
                <Spinner type="CircleFlip" size={150} color={'#ffd700'}/>
              </Animatable.View>
           </View>
        </GestureRecognizer>

          <View style={styles.confirmModal}>
            <InvestConfirmModal amount={this.state.amount} toggleInvestmentReady={this.toggleInvestmentReady}/>
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
    marginRight: '5%'
  },
  amountInput: {
    fontSize: 50,
    width: '80%',
    marginTop: '5%',
  },
  dollarSign: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 50,
    marginLeft: '35%'
  },
  coin: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%'
  },
})

export default connect(mapStateToProps, { setUserInfo, setSavings })(Invest)
