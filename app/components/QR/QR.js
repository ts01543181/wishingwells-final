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
        <View style={styles.body}>
          <QRCode value={this.props.uid} size={250} />
        </View>
        <View style={styles.qrText}>
          {/* <Text>This is your QR code</Text> */}
        </View>
        <View style={styles.qrButton}>
        </View>
      </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  navbar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex:2
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
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
  backgroundImage: {
    width: '100%',
    // height: '100%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
})

export default connect(mapStateToProps)(QR)
