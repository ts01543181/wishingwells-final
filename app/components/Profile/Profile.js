import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import {HOST_IP} from '../../../config.js'
import CashOutModal from './CashOutModal.js'
import * as firebase from 'firebase'

const db = firebase.database()


const mapStateToProps = (state) => {
  return {
    username: state.ProfileReducer.username,
    firstname: state.ProfileReducer.firstname,
    lastname: state.ProfileReducer.lastname,
    email: state.ProfileReducer.email,
    photo: state.PhotoReducer.photo,
    bio: state.ProfileReducer.bio,
    logs: state.SavingsReducer.entries,
    uid: state.ProfileReducer.uid
  }
}

const rightButtonConfig = {
  title: 'SETTINGS',
  handler() {
    Actions.Settings()
  },
  tintColor: 'white'
}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wellSavings: '',
      goal: '',
    }

    this.getTotal = this.getTotal.bind(this)
    this.invest = this.invest.bind(this)
  }

  componentWillMount() {

    // axios.post(`http://${HOST_IP}:4000/api/getWellTotal`, {uid: this.props.uid})
    // .then(({ data }) => {
    //   this.setState({
    //     wellSavings: data[0].native_balance.amount
    //   })
    // })

    db.ref(`users/${this.props.uid}/investmentLogs`).once('value').then(data => {
      console.log('here', data.val())
      let wellSavings = Object.values(data.val()).reduce((sum, accum) => {
        return sum + Number(accum.amount)
      }, 0)

      this.setState({
        wellSavings: wellSavings,
      })
    })

    db.ref(`users/${this.props.uid}/investmentLogs`).on('value', data => {

      let wellSavings = Object.values(data.val()).reduce((sum, accum) => {
        return sum + Number(accum.amount)
      }, 0)

      this.setState({
        wellSavings: wellSavings,
      })
    })

    db.ref(`users/${this.props.uid}`).once('value').then(data => {
      this.setState({
        goal: data.val().goal
      })
    })

    db.ref(`users/${this.props.uid}`).on('value', data => {
      this.setState({
        goal: data.val().goal
      })
    })
  }

  invest() {
    alert('INVESTING')
  }

  getTotal() {
    let total = 0;
    for(let i = 0; i < this.props.logs.length; i++) {
      total += Number(this.props.logs[i]['amount'])
    }
    return total
  }

  render() {
    return (
      <View style={styles.body}>
          <Image source={require('../../../assets/backgroundProfile.jpg')}  style={styles.backgroundImage}>

            <NavigationBar title={{title:'PROFILE', tintColor:"white"}} tintColor='rgba(240, 240, 240, 0.1)' rightButton={rightButtonConfig}/>

            <Image source={{ uri: this.props.photo }} style={styles.image}>
              <View style={styles.namewrap}>
                <Text style={styles.name}>
                  {this.props.firstname} {this.props.lastname}
                </Text>
              </View>
            </Image>
          <ScrollView>

            <View style={styles.info}>
              <Text><Icon name='at' size={25} style={styles.icon}/> {this.props.username}</Text>
              <Text style={styles.email}><Icon name='email-outline' size={25} style={styles.icon}/> {this.props.email}</Text>
            </View>

            <View style={styles.info}>
            <Text style={styles.goalAmount}>W E L L  G O A L : ${this.state.goal}</Text>
            </View>

            <View style={styles.info}>
               <Text style={styles.wellSavingsAmount}>Well Amount: <Icon name='currency-usd' size={25} style={styles.icon}/>{this.state.wellSavings}</Text>
               <CashOutModal style={styles.invest} uid={this.props.uid} wellAmount={this.state.wellSavings}/>
             </View>

            <View style={styles.aboutInfo}>
              <Text style={styles.about}><Icon name='information-outline' size={25} style={styles.icon}/> A B O U T  M E</Text>
              <Text style={styles.bio}>{this.props.bio}</Text>
            </View>

          </ScrollView>
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    // marginBottom: 55
  },
  navbar: {
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // zIndex:2
  },
  about: {
    paddingTop: 15,
    marginLeft: 10,
    fontSize: 20
  },
  bio:{
    marginTop: 10,
    marginLeft: 15
  },
  image: {
    height: 250,
    width: '100%',
    backgroundColor: '#C0C0C0',
  },
  namewrap: {
    marginLeft: 10,
    marginTop: 200,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  name: {
    paddingBottom: 20,
    fontSize: 30,
    top: 10,
    fontWeight: 'bold',
    // color: "#2eb8b8"
    color: 'white',
    shadowOpacity: 70
  },
  icon:{
    marginLeft: 30
  },
  info:{
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 10,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(242,242,242,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  aboutInfo:{
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 8,
    paddingRight: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(242,242,242,0.4)',
  },
  wellSavingsAmount: {
    fontSize: 30
  },
  money:{
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingLeft: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 7,
    marginTop: 10,
    backgroundColor: 'rgba(242,242,242,0.4)',
  },
  button: {
    width: 120,
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'grey',
    paddingLeft: 35,
    paddingTop: 6,
    paddingBottom: 4,
    marginLeft: 130,
    height: 30,
    backgroundColor: 'rgba(190,190,190,0.5)'
  },
  goalAmount: {
    fontSize: 20
  },
  backgroundImage:{
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  invest: {
    color: 'white'
  }
})

export default connect(mapStateToProps)(Profile)
