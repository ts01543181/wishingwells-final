import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';
import { Actions } from 'react-native-router-flux'
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
      <View style={styles.container}>
        <Text style={styles.title}>
          Register Account
        </Text>

        <TextInput
          style={styles.inputFields}
          placeholder="Email"
          onChangeText={(text) => this.setState({email: text})}
          value={this.email}
          autoCorrect={false}
          autoCapitalize='none'
        />

        <TextInput
          style={styles.inputFields}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
          value={this.password}
          autoCorrect={false}
          secureTextEntry={true}
          autoCapitalize='none'
        />

        <TextInput
          style={styles.inputFields}
          placeholder="Re-enter password"
          onChangeText={(text) => this.setState({reEnter: text})}
          value={this.reEnter}
          autoCorrect={false}
          secureTextEntry={true}
          autoCapitalize='none'
        />

        <Button title="Login" onPress={() => Actions.Login()}></Button>
        <Button title="Register" onPress={this._registerAccount}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '20%',
  },
  title: {
    fontWeight: 'bold'
  },
  inputFields: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: '50%',
    marginTop: 20,
    marginLeft: '20%'
  },
  credentials: {
    paddingTop: 20
  }
});
