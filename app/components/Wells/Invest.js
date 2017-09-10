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
import Spinner from 'react-native-spinkit'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    cardID: state.ProfileReducer.cardID,
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

      const ref = db.ref(`users/${this.props.qr}/logs`)

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

              // let buyObj = {
              //   walletAddress: this.props.uid,
              //   uid: this.props.uid,
              //   amount: Number(this.state.amount),
              // }

              // axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
              // .then(({data}) => {
              //   console.log(data)
              //
              //   let fees = (Number(data.total.amount) - Number(data.subtotal.amount)) + 0.3 + (0.03 * Number(this.state.amount));
              //   let feesObj = {
              //     walletAddress: this.props.uid,
              //     cardID: this.props.cardID,
              //     amount: fees * 100,
              //   }
              //
              //   axios.post(`http://${HOST_IP}:4000/api/payFees`, feesObj)
              //   .then(() => {
              //     this.setState({
              //       amount: '',
              //       description: '',
              //       investmentReady: false,
              //     })
              //
              //     alert('Investment Made')
              //   })
              // })
              alert('Investment Made')
            })
          } else {
            alert('Investment denied: Please check credit card input')
          }
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        alert('Invalid card credentials')
      }
    } else {
      alert('Please confirm investment details')
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
            <InvestConfirmModal amount={this.state.amount} toggleInvestmentReady={this.toggleInvestmentReady}/>
          </View>
        </View>
        <GestureRecognizer
          onSwipeUp={(state) => this.onSwipeUp(state)}
          style={styles.coin}
          >
           <View style={styles.coin}> 
            <Spinner type="CircleFlip" size={100} color={'#DAA520'} style={{marginTop:'20%', marginLeft:'37%'}}/>
           </View> 
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
    height: '40%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center'
  },
})

export default connect(mapStateToProps, { setUserInfo })(Invest)
