import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import NavigationBar from 'react-native-navbar'
import * as firebase from "firebase"
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import { connect } from 'react-redux'
import axios from 'axios'
import { HOST_IP } from '../../config.js'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid,
    qr: state.ProfileReducer.qr,
    cardID: state.ProfileReducer.cardID
  }
}
class Well extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
    }
    this.save = this.save.bind(this)
  }


  save() {
    const ref = db.ref(`users/${this.props.uid}/logs`)

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
        amount: this.state.amount,
      }
      axios.post(`http://${HOST_IP}:4000/api/makeSavings`, chargeObj)
      .then(data => {
        console.log(data)
        this.setTimeout(
          () => { alert('Savings Added') },
          750
        );
        let buyObj = {
          walletAddress: this.props.qr,
          uid: this.props.uid,
        }

        // axios.post(`http://${HOST_IP}:4000/api/buyCrypto`, buyObj)
      })
    } else {
      this.setTimeout(
        () => { alert('Savings Logged') },
        750
      );
    }
  }





  render() {
    return (
      <View>
        <View>
          <NavigationBar title={{title:'Wishing Well'}} tintColor='#99ccff'/>
        </View>
        <View style={styles.inputFields}>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Input Amount</Text>
          </View>
          <TextInput style={styles.amountInputField} placeholder="Amount Here" onChangeText={(text) => this.setState({amount: text})} value={this.state.amount}/>
          <View style={{height: "20%"}}>
            <Text style={styles.credentials}>Description</Text>
          </View>
          <TextInput style={styles.descriptionInputField} placeholder='Description Here' onChangeText={(text) => this.setState({description: text})} value={this.state.description}/>
        </View>
        <Button title="save" onPress={this.save}></Button>
      </View>
    )
  }
}

reactMixin(Well.prototype, TimerMixin);

const styles = StyleSheet.create({
  coin: {
    height: '80%',
    width: '100%',
  },
  inputFields: {
    marginTop: '5%',
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
  amountInputField: {
    width: '100%',
    height: '30%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center'
  },
  descriptionInputField: {
    width: '100%',
    height: '30%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center'
  }
})

export default connect(mapStateToProps)(Well)
