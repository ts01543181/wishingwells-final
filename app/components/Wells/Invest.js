import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Button } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import axios from 'axios'
import InvestConfirmModal from './InvestConfirmModal.js'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import { HOST_IP } from '../../../config.js'


const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    qr: state.ProfileReducer.donationID,
    cardID: state.ProfileReducer.cardID,
    receiverTotal: 0,
  }
}

class Invest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      paymentReady: false,
    }
    this.onSwipeUp = this.onSwipeUp.bind(this);
    this.togglePaymentReady = this.togglePaymentReady.bind(this);
  }

  togglePaymentReady() {
    this.setState({
      paymentReady: true,
    })
  }

  onSwipeUp(gestureState) {
    console.log(this.props.qr)
    if (this.state.paymentReady) {

      const ref = db.ref(`users/${this.props.qr}/logs`)

      ref.push({
        date: new Date().toDateString(),
        amount: this.state.amount,
        description: this.state.description
      })
      this.setState({
        amount: '',
        description: '',
      })

      if (this.props.qr !== '' && this.props.cardID !== '') {
        let chargeObj = {
          walletAddress: this.props.qr,
          cardID: this.props.cardID,
          amount: Number(this.state.amount),
        }
        axios.post(`http://${HOST_IP}:4000/api/makeDonation`, chargeObj)
        .then(data => {
          console.log(data)

          db.ref(`users/${this.props.qr}`).once('value', (user) => {

            db.ref(`users/${this.props.qr}`).update({
              total: user.val().total + chargeObj.amount
            })

            this.setState({
              paymentReady: false
            })

            // let buyObj = {
            //   walletAddress: this.props.qr,
            //   uid: this.props.uid,
            // }

            // axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
          })
        })
      } else {
        alert('Invalid card credentials')
      }
    } else {
      alert('Please confirm donation details')
    }
  }

  render() {

    return (
      <View>
        <View style={styles.inputFields}>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Input Amount</Text>
          </View>
          <TextInput style={styles.amountInputField} placeholder="Amount Here" onChangeText={(text) => this.setState({amount: Number(text)})} value={this.state.amount}/>
          <View style={styles.confirmModal}>
            <InvestConfirmModal amount={this.state.amount} description={this.state.description} togglePaymentReady={this.togglePaymentReady}/>
          </View>
        </View>
        <GestureRecognizer
          onSwipeUp={(state) => this.onSwipeUp(state)}
          style={styles.coin}
          >
          <View style={styles.coin}></View>
        </GestureRecognizer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  coin: {
    top: '6%',
    height: '75%',
    width: '100%',
  },
  inputFields: {
    marginTop: '2%',
    marginLeft: '25%',
    height: '20%',
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
    marginTop: '5%',
    height: '10%',
    width: 100,
  },
  amountInputField: {
    width: '100%',
    height: '20%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center'
  },
  descriptionInputField: {
    width: '100%',
    height: '40%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 15,
  },
})

export default connect(mapStateToProps, { setUserInfo })(Invest)
