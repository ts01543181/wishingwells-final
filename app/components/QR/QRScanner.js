import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, Linking, Dimensions, LayoutAnimation, StatusBar, TouchableOpacity, TouchableHighlight } from 'react-native'
import NavigationBar from 'react-native-navbar'
import QRCode from 'react-native-qrcode'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'
import { setUserInfo } from '../../Actions/Profile/ProfileAction'
import Camera from 'react-native-camera';

class QRScanner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      lastScannedUrl: null,
      donationID: '',
    };
    this.displayQR = this.displayQR.bind(this)
  }

  displayQR(data) {
    if (data.data !== this.state.lastScannedUrl) {
      this.setState({
        lastScannedUrl: data.data
      })
      Alert.alert(
        'Donate to this Well?',
        this.state.lastScannedUrl,
        [
          {
            text: 'Yes',
            onPress: () => {
              this.props.setUserInfo({
                donationID: this.state.donationID,
              })
              Actions.DonationWell()
            },
          },
          { text: 'No', onPress: () => {
            this.setState({
              lastScannedUrl: null
            })
          } },
        ],
        { cancellable: false }
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={data => {this.displayQR(data)}}>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

export default connect(null, { setUserInfo} )(QRScanner)
