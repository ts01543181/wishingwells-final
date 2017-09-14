import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput,Button, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Login from './Login'
import { firebaseRef } from '../services/firebase'
import * as firebase from 'firebase'

const db = firebase.database()

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      reEnter: ''
    }
    this._registerAccount = this._registerAccount.bind(this)
  }

  _registerAccount() {
    if (this.state.password === this.state.reEnter) {
      firebaseRef.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(data => {
        console.log('successfully created an account', data)
        firebase.database().ref(`users/${data.uid.substring(0, 10)}`).set({
          username: '',
          firstname: '',
          lastname: '',
          email: data.email,
          uid: data.uid.substring(0, 10),
          bio: '',
          cardID: '',
          wallet: '',
          photo: '',
          total: 0,
          goal: 100
        })
      })
      .catch(err => {
        console.log(err.code)
        console.log(err.message)
      })

    Actions.Login()
      } else {
        alert('There is something wrong with your credentials!')
      }
    }

  render() {
    return (
        <View>
        <Image source={require('../../assets/background2.jpg')}  style={styles.backgroundImage}>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>
          C R E A T E   A N   A C C O U N T 
          </Text>
        </View>

      <View style={styles.containerWrap}>
      <View style={styles.container}>
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
        <View style={styles.secondSection}>
          <Icon style={styles.email} name="lock-outline" size={20} color="#F0F0F0"/>
          <TextInput
            style={styles.inputFields}
            placeholder="RE-ENTER PASSWORD"
            onChangeText={(text) => this.setState({reEnter: text})}
            value={this.password}
            autoCorrect={false}
            secureTextEntry={true}
            autoCapitalize='none'
          />
        </View> 
        </View> 
        <TouchableOpacity onPress={this._registerAccount} style={styles.signup}>
          <Text style={styles.signupText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Actions.Login()} style={styles.back}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
      
      </View>

      </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputSection:{
    borderBottomWidth: 0.5,
    borderColor: '#F8F8F8',
    paddingBottom: 10,
    marginTop: 65,
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
  titleWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#E8E8E8',
    marginTop: 90,
 },
  container: {
    alignItems: 'center',
    height: 270,
    width: 320,
    backgroundColor: 'rgba(242,242,242,0.13)',
    borderRadius: 25,
    marginTop: 60,
  },
  containerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFields: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 225,
    marginTop: 1,
    fontSize: 13,
    paddingBottom: 5,
    color: 'white'
  },
  email: {
    marginRight: 20,
    marginBottom: 10
  },
  signup: {
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    paddingLeft: 110,
    paddingRight: 110,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 80
  },
  signupText: {
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
  back:{
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    paddingLeft: 120,
    paddingRight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 10
  },
  backText: {
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