import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'
import { setSavings } from '../Actions/Savings/SavingsAction'
import { setUserInfo } from '../Actions/Profile/ProfileAction'
import { setUserPhoto } from '../Actions/Profile/PhotoAction'
import { setBitcoinValue } from '../Actions/Bitcoin/BitcoinAction'
import axios from 'axios'
import { VictoryLine, VictoryChart, VictoryTheme } from "victory-native"
import { HOST_IP } from '../../config.js'
import * as Progress from 'react-native-progress'

const mapStateToProps = (state) => {
  return {
    uid: state.ProfileReducer.uid,
    logs: state.SavingsReducer.entries,
    username: state.ProfileReducer.username,
    firstname: state.ProfileReducer.firstname,
    lastname: state.ProfileReducer.lastname,
    email: state.ProfileReducer.email,
    bio: state.ProfileReducer.bio,
    photo: state.PhotoReducer.photo,
    qr: state.ProfileReducer.qr,
    cardID: state.ProfileReducer.cardID,
    total: state.ProfileReducer.total,
    bitcoinValue: state.BitcoinValueReducer.bitcoinValue
  }
}

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: []
    }
    this.getTotal = this.getTotal.bind(this)
  }

  componentWillMount() {
    firebase.database().ref(`users/${this.props.uid}`).once('value').then(data => {
      let logs = (data.val().logs) ? Object.values(data.val().logs) : [];
      let { username, firstname, lastname, email, photo, bio, wallet, cardID, total, donationID } = data.val()
      this.props.setUserInfo({
        username,
        firstname,
        lastname,
        email,
        bio,
        qr: wallet,
        cardID,
        total,
        donationID
      })
      this.props.setSavings(logs)
      this.props.setUserPhoto(photo)
    })

    axios.get(`http://${HOST_IP}:80/api/getBitcoinValue`)
    .then(({ data }) => {
      this.props.setBitcoinValue(data)
    })

    axios.get('https://api.coindesk.com/v1/bpi/historical/close.json')
    .then(({ data }) => {
      console.log('bitcoin historical value', data.bpi)
      let rawData = data.bpi
      let dates = Object.keys(rawData)
      let values = Object.values(rawData)

      let final = []
      for (let i = 0; i < dates.length; i ++) {
        let obj = {}
        let date = dates[i].split('-').join('').slice(6)
        obj.x = date
        obj.y = values[i]
        final.push(obj)
      }

      this.setState({
        history: final
      })
    })
  }

  getTotal() {
    let total;
    firebase.database().ref(`users/${this.props.uid}`).on('value', (data) => {
      total = data.val().total
    })
    return total;
    // let total = 0;
    // for(let i = 0; i < this.props.logs.length; i++) {
    //   total += Number(this.props.logs[i]['amount'])
    // }
    // return total
  }

  render() {
    return (
      <View>
        <View>
          <NavigationBar title={{title:'My Wishing Well'}} tintColor='#99ccff'/>
        </View>

          <ScrollView>
          <Text>{this.getTotal()}</Text>

          <Text style={{fontSize: 40}}>1 Bitcoin = ${this.props.bitcoinValue}</Text>
          <VictoryChart
            theme={VictoryTheme.material}
          >
            <VictoryLine
              data={this.state.history}
              style={{
                data: { stroke: "#99ccff" },
                parent: { border: "1px solid #ccc"}
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
              <Text>Well</Text>
            <Progress.Bar progress={0.5} width={200} height={120} style={styles.bar}/>
          </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  date: {
    textAlign: 'left'
  },
  amount: {
    textAlign: 'right',
    marginRight: 15
  },
  bar: {
    transform: [{ rotate: '270deg'}],
    marginTop: '30%',
    marginLeft: '23%',
    marginBottom: '40%'
  }
})

export default connect(mapStateToProps, { setSavings, setUserInfo, setUserPhoto, setBitcoinValue })(LandingPage)
