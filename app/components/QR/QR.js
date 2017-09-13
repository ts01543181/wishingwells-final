import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, Button,Image } from 'react-native'
import NavigationBar from 'react-native-navbar'
import QRCode from 'react-native-qrcode'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'


const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid
  }
}

const leftButtonConfig = {
  title: 'QR SCANNER',
  handler() {
    Actions.QRScanner()
  },
  tintColor: 'white'
}
class QR extends Component {

  render() {

    return (
      <Image source={require('../../../assets/backgroundProfile.jpg')}  style={styles.backgroundImage}>

      <View>
        <View style={styles.navbar}>
        <NavigationBar title={{title:'MY QR', tintColor:"white"}} tintColor='rgba(220, 220, 220, 0.1)' leftButton={leftButtonConfig}/>
        </View>

        <View style={styles.center}>
        <View style={styles.body}>
          <QRCode value={this.props.uid} size={250} />
        </View>
        </View>

        <View style={styles.qrText}>
          <Text></Text>
          <Text></Text>
          <Text style={styles.qrMessage}>This is your QR code, have someone scan it to help fill your well!</Text>
        </View>
        <View style={styles.qrButton}>
        </View>
      </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 130,
    backgroundColor: 'rgba(250,250,250,0.5)',
    borderRadius: 10,
    padding: '5%',
    width: '78%'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%'
  },
  qrMessage: {
    width: '63%',
    textAlign: 'center'
  },
  backgroundImage: {
    width: '100%',
    // height: '100%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
})

export default connect(mapStateToProps)(QR)
