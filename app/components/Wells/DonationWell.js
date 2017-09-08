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


const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    qr: state.ProfileReducer.donationID,
    cardID: state.ProfileReducer.cardID,
    paymentReady: state.ProfileReducer.paymentReady
  }
}

class DonationWell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      coinSpeed: 20,
    }
    this.onSwipeUp = this.onSwipeUp.bind(this);
  }

  componentDidMount() {
      this.setInterval(
        () => { this.slowDown() },
        500
      );
    }

  onSwipeUp(gestureState) {

    if (this.props.paymentReady) {

      this.props.setUserInfo({
        paymentReady: false,
      })

      this.setState({
        coinSpeed: 2
      });

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
          alert('POST MADE')
          console.log(data)

          db.ref(`users/${this.props.qr}/total`).on('value', (donationTotal) => {
            alert('REQ MADE')
            const ref = db.ref(`users/${this.props.qr}`)

            ref.update({
              total: donationTotal.val() + chargeObj.amount
            })

            this.setTimeout(
              () => { alert('Donation Made!!!') },
              500
            );
            // let buyObj = {
            //   walletAddress: this.props.qr,
            //   uid: this.props.uid,
            // }

            // axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
          })
        })
      } else {
        this.setTimeout(
          () => { alert('Donation Logged') },
          500
        );
      }
    } else {
      alert('Please confirm donation details')
    }
  }

  render() {

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <View>
        <View>
          <NavigationBar title={{title:'Wishing Well'}} tintColor='#99ccff'/>
        </View>
        <View style={styles.inputFields}>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Input Amount</Text>
          </View>
          <TextInput style={styles.amountInputField} placeholder="Amount Here" onChangeText={(text) => this.setState({amount: Number(text)})} value={this.state.amount}/>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Description</Text>
          </View>
          <TextInput placeholder='Description Here' placeholderTextColor={'#A8A8A8'} style={styles.descriptionInputField} multiline={true} numberOfLines={2} onChangeText={(text) => this.setState({description: text})} value={this.state.description}/>
          <View style={styles.confirmModal}>
            <ConfirmModal amount={this.state.amount} description={this.state.description}/>
          </View>
        </View>
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

export default connect(mapStateToProps, { setUserInfo })(DonationWell)
