import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Button, Image } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
import * as firebase from "firebase"
import { connect } from 'react-redux'
import axios from 'axios'
import ConfirmModal from './ConfirmModal.js'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import { Actions } from 'react-native-router-flux'
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

const rightButtonConfig = {
  title: 'INVEST',
  handler() {
    Actions.Invest()
  },
  tintColor: 'white'
}

class Well extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      paymentReady: false,
      total: null
    }
    this.addToWallet = this.addToWallet.bind(this);
  }

  componentDidMount() {
    firebase.database().ref(`users/${this.props.uid}`).on('value', (data) => {
      this.props.setUserInfo({
        total: data.val().total
      })
    })
  }

  addToWallet() {

      const ref = db.ref(`users/${this.props.uid}/logs`)

      ref.push({
        date: new Date().toDateString(),
        time: new Date().getTime(),
        amount: this.state.amount,
        description: this.state.description
      })

      let chargeObj = {
        walletAddress: this.props.qr,
        cardID: this.props.cardID,
        amount: Number(this.state.amount),
      }

      const totalRef = db.ref(`users/${this.props.uid}`)

      totalRef.update({
        total: this.props.total + chargeObj.amount
      })

      this.props.setUserInfo({
        total: this.props.total + chargeObj.amount
      })

      this.setState({
        amount: '',
        description: '',
      })


          // let buyObj = {
          //   walletAddress: this.props.qr,
          //   uid: this.props.uid,
          // }

          // axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
    }

  render() {
    return (
    <KeyboardAwareScrollView>
    <View style={styles.container}>
      <Image source={require('../../../assets/background2sliced.jpg')}  style={styles.backgroundImage}>
          <View style={styles.navbar}>
          <NavigationBar title={{title:'WISHING WELL', tintColor:"white"}} tintColor='rgba(240, 240, 240, 0.1)' rightButton={rightButtonConfig}/>
          </View>

          <View style={styles.walletAmountContainer}>
            <Text style={styles.walletAmount}>${this.props.total.toFixed(2)}</Text>
            <Text style={styles.walletText}>WALLET BALANCE</Text>
          </View>
      </Image>

          <View>

            <View style={styles.amountWrap}>
                <Text style={styles.dollarSign}>$</Text>
                  <TextInput style={styles.amountInputField} placeholder="0" keyboardType={'numeric'} onChangeText={(text) => this.setState({amount: text})} value={String(this.state.amount)}/>
            </View>

            <View style={styles.descriptionWrap}>
              <TextInput placeholder='Description Here' style={styles.descriptionInputField} multiline={true} numberOfLines={2} onChangeText={(text) => this.setState({description: text})} maxLength={54} value={this.state.description}/>
            </View>

            <View style={styles.confirmModal}>
              <ConfirmModal amount={this.state.amount} description={this.state.description} addToWallet={this.addToWallet}/>
            </View>

          </View>

        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  backgroundImage:{
    width: '100%',
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0)',
    resizeMode: 'cover'
  },
  container: {
    height: '113%',
    backgroundColor: 'white'
  },
  walletAmountContainer: {
    marginTop: '5%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  walletText:{
    fontSize: 14,
    color: 'white',
  },
  walletAmount: {
    fontSize: 60,
    color: 'white'
  },
  inputFields: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  amountWrap: {
    flex: 1,
    flexDirection:'row',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 300,
    width: '70%',
    height: '90%',
    paddingTop: '25%',
    paddingBottom: '25%',
    justifyContent:'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(121, 226, 231, 0.31)',
  },
  dollarSign:{
    backgroundColor:'rgba(0,0,0,0)',
    fontSize: 18,
  },
  amountInputField: {
    textAlign: 'center',
    width:'50%',
    fontSize: 60,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
  },
  descriptionWrap:{
    width: '97%',
    marginLeft: '1%',
    textAlign:'left'
  },
  descriptionInputField: {
    width: '100%',
    borderColor: 'gray',
    borderBottomWidth: 0.5,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 20
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
  credentials: {
    paddingTop: 10
  },
  confirmModal: {
    flex: 1,
    justifyContent:'center',
    alignSelf: 'center',
    height: '10%',
    width: 100,
  },
})

export default connect(mapStateToProps, { setUserInfo })(Well)
