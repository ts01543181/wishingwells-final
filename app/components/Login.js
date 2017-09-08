import React, { Component } from 'react';
import {
 StyleSheet,
 Text,
 View,
 TextInput,
 Button,
 ActivityIndicator,
} from 'react-native';
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

  _login() {
    firebaseRef.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(data => {
      if (data) {
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
        for (let i = 0; i < 100; i ++) {
            this.setState({
              progress: this.state.progress + 0.1
            })
        }
      }
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
  }



  render() {
    console.log('this is teh host IP ', `http://${HOST_IP}:4000/api/getBitcoinValue`)
    return (
      <View style={styles.container}>
        <Icon name="currency-usd" size={30} color="#000" />
        <Text style={styles.title}>
          Wishing Well
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

        <Button title="Login" onPress={this._login}></Button>

        <Button title="Register" onPress={() => Actions.Register()}></Button>
        <Button title="Bypass" onPress={() => Actions.Home()}></Button>

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
 },
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
  },
  centering: {
    justifyContent:'center',
    alignItems:'center',
    marginTop: '90%',
  },
});


export default connect(null, { setUserInfo, setBitcoinValue })(Login);
