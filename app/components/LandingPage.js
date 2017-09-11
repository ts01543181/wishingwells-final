import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, FlatList, RefreshControl, Image} from 'react-native';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'
import { setSavings } from '../Actions/Savings/SavingsAction'
import { setUserInfo } from '../Actions/Profile/ProfileAction'
import { setUserPhoto } from '../Actions/Profile/PhotoAction'
import { setBitcoinValue } from '../Actions/Bitcoin/BitcoinAction'
import axios from 'axios'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie} from "victory-native"
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
    goal: state.ProfileReducer.goal,
    bitcoinValue: state.BitcoinValueReducer.bitcoinValue
  }
}

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [],
      refreshing: false,
      wellSavings: '',
      pieData: [],
      colorScale: []
    }
    // this.getTotal = this.getTotal.bind(this)
  }

  componentWillMount() {
    firebase.database().ref(`users/${this.props.uid}`).once('value').then(data => {
      let logs = (data.val().logs) ? Object.values(data.val().logs) : [];
      let { username, firstname, lastname, email, photo, bio, wallet, cardID, total, goal, donationID } = data.val()
      this.props.setUserInfo({
        username,
        firstname,
        lastname,
        email,
        bio,
        qr: wallet,
        cardID,
        total,
        goal,
        donationID
      })
      this.props.setSavings(logs)
      this.props.setUserPhoto(photo)
    })
    firebase.database().ref(`users/${this.props.uid}`).on('value', (snapshot) => {
      let { total, wallet, goal } = snapshot.val()
        if (wallet !== '') {
          axios.post(`http://${HOST_IP}:4000/api/getWellTotal`, {uid: this.props.uid})
          .then(({ data }) => {
            this.setState({
              wellSavings: data[0].native_balance.amount
            })
            if (this.props.total > 0) {
              this.setState({
                pieData: [
                  { x: "Well", y: (+this.state.wellSavings / goal) * 100},
                  { x: 'Wallet', y: (total / goal) * 100},
                  { x: 'Goal', y: ((goal - (total + +this.state.wellSavings)) / goal) * 100},
                ],
                colorScale: ['#f3d8e5', '#e7b1cb', '#D0D0D0']
              })
            } else {
              this.setState({
                pieData: [
                  { x: "Well", y: (+this.state.wellSavings / goal) * 100},
                  { x: 'Goal', y: ((goal - (total + +this.state.wellSavings)) / goal) * 100},
                ],
                colorScale: ['#f3d8e5', '#D0D0D0']
              })
            }

          })
        } else {
          this.setState({
            pieData: [
              { x: 'Wallet', y: (total / goal) * 100},
              { x: 'Goal', y: ((goal - total) / goal) * 100},
            ],
            colorScale: ['#e7b1cb', '#D0D0D0']
          })
        }
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

  _onRefresh() {

    this.setState({refreshing: true});
    axios.get(`http://${HOST_IP}:80/api/getBitcoinValue`)
    .then(({ data }) => {
      this.props.setBitcoinValue(data)
    })
    // .then(() => this.setState({refreshing: false}))

    // axios.get('https://api.coindesk.com/v1/bpi/historical/close.json')
    // .then(({ data }) => {
    //   console.log('bitcoin historical value', data.bpi)
    //   let rawData = data.bpi
    //   let dates = Object.keys(rawData)
    //   let values = Object.values(rawData)

    //   let final = []
    //   for (let i = 0; i < dates.length; i ++) {
    //     let obj = {}
    //     let date = dates[i].split('-').join('').slice(6)
    //     obj.x = date
    //     obj.y = values[i]
    //     final.push(obj)
    //   }

    //   this.setState({
    //     history: final
    //   })
    // })
    this.setState({refreshing: false});
  }

  // getTotal() {
  //   let total;
  //   firebase.database().ref(`users/${this.props.uid}`).on('value', (data) => {
  //     total = data.val().total
  //   })
  //   return total;
  //   // let total = 0;
  //   // for(let i = 0; i < this.props.logs.length; i++) {
  //   //   total += Number(this.props.logs[i]['amount'])
  //   // }
  //   // return total
  // }

  render() {
    return (
      <View style={styles.body}>
      <Image source={require('../../assets/backgroundProfile.jpg')}  style={styles.backgroundImage}>
      {/* <View> */}
        <View>
        <NavigationBar title={{title:'WISHING WELL', tintColor:"white"}} tintColor='rgba(240, 240, 240, 0.1)'/>
        </View>
          <ScrollView
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              />}
          >
          <View style={styles.bla}>
            <View style={styles.chartWrap}>
              <Text style={styles.chartText}>P R I C E  C H A R T</Text>
              <VictoryChart
                theme={VictoryTheme.material}
              >
                <VictoryLine
                interpolation="natural"

                  data={this.state.history}
                  style={{
                    data: { stroke: "#df9fbe" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 }
                  }}
                />
              </VictoryChart>
            </View>
          </View>

          <View style={styles.goalWrap}>
            <Text style={styles.goalText}>G O A L: ${this.props.goal}</Text>
            <Text style={styles.goalText}>W E L L  S A V I N G S: ${this.state.wellSavings || 0}</Text>
          </View>


            <View style={styles.pieWrap}>
              <View style={{marginBottom: '10%'}}>
              <Text style={styles.chartText}>G O A L  C H A R T</Text>
                <VictoryPie data={this.state.pieData}
                colorScale={this.state.colorScale}
                innerRadius={50}
                width={350}
                />
              </View>
            </View>
          </ScrollView>
          </Image>
       </View>
    )
  }
}

const styles = StyleSheet.create({
  bla: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  priceWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    marginLeft: 25,
    marginRight: 25,
  },
  body: {
    marginBottom: '45%'
  },
  backgroundImage: {
    width: '100%',
    height: '38%',
    backgroundColor: 'rgba(0,0,0,0)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  chartWrap: {
    backgroundColor: 'rgba(250,250,250,0.5)',
    height: 380,
    borderRadius: 20,
    marginTop: 20,
  },
  priceCurr: {
    color: 'white',
    fontSize: 20,
    textAlign:'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  priceText: {
    color: 'white',
    fontSize: 30,
    marginTop: 45,
    textAlign:'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  priceBox: {
    backgroundColor: 'rgba(250,250,250,0.5)',
    width: 150,
    height: 150,
    borderRadius: 20
  },
  date: {
    textAlign: 'left'
  },
  amount: {
    textAlign: 'right',
    marginRight: 15
  },
  bar: {
    transform: [{ rotate: '270deg'}],
    marginTop: '20%',
    marginLeft: '23%',
    marginBottom: '40%'
  },
  chartText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    color: 'grey'
  },
  wellText:{
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    color: 'grey'
  },
  pieWrap:{
    backgroundColor: 'rgba(250,250,250,0.5)',
    width: 380,
    height: 390,
    borderRadius: 20,
    marginTop: 18,
  },
  goalWrap: {
    backgroundColor: 'rgba(250,250,250,0.5)',
    width: 380,
    height: 100,
    borderRadius: 20,
    marginTop: 18,
    justifyContent: 'center'
  },
  goalText: {
    alignSelf: 'center',
    fontSize: 16,
    color: 'grey',
    marginBottom: 5
  }
})

export default connect(mapStateToProps, { setSavings, setUserInfo, setUserPhoto, setBitcoinValue })(LandingPage)
