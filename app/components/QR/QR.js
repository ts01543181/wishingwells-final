import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, Button } from 'react-native'
import NavigationBar from 'react-native-navbar'
import QRCode from 'react-native-qrcode'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'


const mapStateToProps = state => {
  return {
    uid: state.ProfileReducer.uid
  }
}

class QR extends Component {

  render() {

    return (
      <View>
        <View style={styles.navbar}>
          <NavigationBar title={{title:'QR Code'}} tintColor='#99ccff'/>
        </View>
        <View style={styles.body}>
          <QRCode value={this.props.uid} size={250} />
        </View>
        <View style={styles.qrText}>
          <Text>This is your QR code</Text>
        </View>
        <View style={styles.qrButton}>
          <Button title="QRScanner" onPress={() => Actions.QRScanner()}>Scan a QR Code</Button>
        </View>
      </View>
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
    marginTop: '10%'
  },
  qrText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%'
  }
})

export default connect(mapStateToProps)(QR)
