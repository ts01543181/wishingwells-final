import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Image, TouchableOpacity, ScrollView, Button } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import DonationWell from './DonationWell.js'
import {HOST_IP} from '../../../config.js'
import * as firebase from 'firebase'

const db = firebase.database()

const mapStateToProps = state => {
  return {
    qr: state.ProfileReducer.donationID,
  }
}

const rightButtonConfig = {
  title: 'SETTINGS',
  handler() {
    Actions.Settings()
  },
  tintColor: 'white'
}

class DonationProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wellSavings: '',
      goal: '',
      bio: '',
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      photo: '',
    }

  }

  componentWillMount() {
    db.ref(`users/${this.props.qr}`).once('value').then(data => {
      this.setState({
        goal: data.val().goal,
        bio: data.val().bio,
        username: data.val().username,
        email: data.val().email,
        firstname: data.val().firstname,
        lastname: data.val().lastname,
        photo: data.val().photo
      })
    })
  }

  render() {
    return (
      <View style={styles.body}>
        <Image source={require('../../../assets/background2.jpg')}  style={styles.backgroundImage}>

            <Image source={{ uri: this.state.photo }} style={styles.image}>
              <View style={styles.namewrap}>
                <Text style={styles.name}>
                  {this.state.firstname} {this.state.lastname}
                </Text>
              </View>
            </Image>
          <ScrollView>

            <View style={styles.info}>
              <Text><Icon name='at' size={25} style={styles.icon}/> {this.state.username}</Text>
              <Text style={styles.email}><Icon name='email-outline' size={25} style={styles.icon}/> {this.state.email}</Text>
            </View>

            <View style={styles.info}>
               <Text style={styles.goalAmount}>W E L L  G O A L : ${this.state.goal}</Text>
               <Button title="Donate" onPress={Actions.DonationWell}></Button>
             </View>

            <View style={styles.aboutInfo}>
              <Text style={styles.about}><Icon name='information-outline' size={25} style={styles.icon}/> A B O U T  M E</Text>
              <Text style={styles.bio}>{this.state.bio}</Text>
            </View>

          </ScrollView>
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
  backgroundImage:{
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  invest: {
    color: 'white'
  },
  goalAmount: {
    fontSize: 20
  }
})

export default connect(mapStateToProps)(DonationProfile)
