import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux'
import Register from './Register'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { firebaseRef } from '../services/firebase'
import * as firebase from 'firebase'
import { fbAppId } from '../../config'
import { connect } from 'react-redux'
import { setUserInfo } from '../Actions/Profile/ProfileAction'
import { setBitcoinValue } from '../Actions/Bitcoin/BitcoinAction'
import axios from 'axios'
import { HOST_IP } from '../../config.js'
import Spinner from 'react-native-spinkit'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loading: false,
      progress: 0
    }
    this._login = this._login.bind(this)
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((data) => {
      if (data) {
        this.setState({loading: true})

        const uid = data.uid.substring(0, 10)
        this.props.setUserInfo({
          email: data.email,
          uid: uid,
        })

        axios.get(`http://${HOST_IP}:4000/api/getBitcoinValue`)
        .then(({ data }) => {
          this.props.setBitcoinValue(data)
          Actions.Home()
        })
        .catch(err => {
          console.log(err)
        })
        return
      } 
    });
  }

  _login() {
    firebaseRef.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(data => {
      if (data) {
        this.setState({loading: true})

        const uid = data.uid.substring(0, 10)
        this.props.setUserInfo({
          email: data.email,
          uid: uid,
        })

        axios.get(`http://${HOST_IP}:4000/api/getBitcoinValue`)
        .then(({ data }) => {
          this.props.setBitcoinValue(data)
          Actions.Home()
        })
        .catch(err => {
          console.log(err)
        })

      }
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
  }

  render() {

    return this.state.loading?
    <View style={styles.spinnerContainer}>
      <Spinner type="FadingCircleAlt" style={styles.spinner}/>
    </View>
    : (
      <View>
        
        <View>
        <Image source={require('../../assets/background2.jpg')}  style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>
          W I S H I N G  W E L L
        </Text>
        <View style={styles.inputSection}>
          <Icon style={styles.email} name="email-outline" size={20} color="#F0F0F0"/>
          <TextInput
            style={styles.inputFields}
            placeholder="EMAIL"
            onChangeText={(text) => this.setState({email: text})}
            value={this.email}
            autoCorrect={false}
            autoCapitalize='none'
          />
        </View>
        <View style={styles.secondSection}>
          <Icon style={styles.email} name="lock-outline" size={20} color="#F0F0F0"/>
          <TextInput
            style={styles.inputFields}
            placeholder="PASSWORD"
            onChangeText={(text) => this.setState({password: text})}
            value={this.password}
            autoCorrect={false}
            secureTextEntry={true}
            autoCapitalize='none'
          />
        </View>
        <TouchableOpacity onPress={this._login} style={styles.login}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={styles.signupSection}>
          <Text style={styles.account}>DONT HAVE AN ACCOUNT?</Text>
          <TouchableOpacity onPress={() => Actions.Register()}>
            <Text style={styles.signupText}>   SIGN UP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bypass} onPress={() => Actions.Home()}>
          <Text style={styles.account} > BYPASS </Text>
        </TouchableOpacity>
      </View>
      </Image>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputSection:{
    borderBottomWidth: 0.5,
    borderColor: '#F8F8F8',
    paddingBottom: 10,
    marginTop: 280,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondSection:{
    borderBottomWidth: 0.5,
    borderColor: '#F8F8F8',
    paddingBottom: 10,
    marginTop: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage:{
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  background:{
    flex: 1,
    width: 200,
    height: 400,
  },
  spinnerContainer: {
    alignItems: 'center',
  },
  spinner: {
    marginTop: '80%'
  },
 title: {
   fontSize: 20,
   color: '#E8E8E8',
 },
 credentials: {
   paddingTop: 20
 },
  container: {
    alignItems: 'center',
    marginTop: '20%',
  },
  inputFields: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: '50%',
    marginTop: 1,
    fontSize: 13,
    paddingBottom: 5,
    color: 'white'
  },
  centering: {
    justifyContent:'center',
    alignItems:'center',
    marginTop: '90%',
  },
  email: {
    marginRight: 20,
    marginBottom: 10
  },
  login: {
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    paddingLeft: 110,
    paddingRight: 110,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 40
  },
  loginText: {
    color: '#FFFFFF'
  },
  signupSection:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 215,
    marginTop: 40,
  },
  signupText:{
    color: '#F8F8F8',
    fontWeight: 'bold',
    fontSize: 13
  },
  account: {
    color: '#E0E0E0',
    fontSize: 12
  },
  bypass:{
    marginTop: 10
  }
});


export default connect(null, { setUserInfo, setBitcoinValue })(Login);
