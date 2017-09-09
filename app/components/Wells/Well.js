import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Button } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import axios from 'axios'
import ConfirmModal from './ConfirmModal.js'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import { HOST_IP } from '../../../config.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    qr: state.ProfileReducer.qr,
    cardID: state.ProfileReducer.cardID,
    total: state.ProfileReducer.total,
  }
}

class Well extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      coinSpeed: 20,
      paymentReady: false
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
    if (this.state.paymentReady) {

      const ref = db.ref(`users/${this.props.uid}/logs`)

      ref.push({
        date: new Date().toDateString(),
        time: new Date().getTime(),
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
        axios.post(`http://${HOST_IP}:4000/api/makeSavings`, chargeObj)
        .then(data => {
          console.log(data)

          const ref = db.ref(`users/${this.props.uid}`)

          ref.update({
            total: this.props.total + chargeObj.amount
          })

          this.props.setUserInfo({
            total: this.props.total + chargeObj.amount
          })

          alert('Savings Added')
          this.setState({
            paymentReady: false
          })

          // let buyObj = {
          //   walletAddress: this.props.qr,
          //   uid: this.props.uid,
          // }

          // axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
        })
      } else {
        alert('Savings Logged')
      }
    } else {
      alert('Please confirm savings details')
    }
  }

  render() {

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <View>
        <KeyboardAwareScrollView>
        <View style={styles.navbar}>
          <NavigationBar title={{title:'Wishing Well'}} tintColor='#99ccff'/>
        </View>
        <View style={styles.inputFields}>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Input Amount</Text>
          </View>
          <TextInput style={styles.amountInputField} placeholder="Amount here" placeholderTextColor={'#A8A8A8'} multiline={true} onChangeText={(text) => this.setState({amount: Number(text)})} value={String(this.state.amount)}/>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Description</Text>
          </View>
          <TextInput placeholder='Description Here' placeholderTextColor={'#A8A8A8'} style={styles.descriptionInputField} multiline={true} numberOfLines={2} onChangeText={(text) => this.setState({description: text})} value={this.state.description}/>
          <View style={styles.confirmModal}>
            <ConfirmModal amount={this.state.amount} description={this.state.description} togglePaymentReady={this.togglePaymentReady}/>
          </View>
        </View>
        </KeyboardAwareScrollView>
        <GestureRecognizer
          onSwipeUp={(state) => this.onSwipeUp(state)}
          config={config}
          style={styles.coin}
          >
          <View style={styles.coin}></View>
        </GestureRecognizer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navbar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex:2
  },
  coin: {
    top: '6%',
    height: '55%',
    width: '100%',
  },
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
    textAlign: 'center',
    fontSize: 15,
    marginTop: 20,
  },
  descriptionInputField: {
    width: '100%',
    height: '70%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 20
  },
})

export default connect(mapStateToProps, { setUserInfo })(Well)
