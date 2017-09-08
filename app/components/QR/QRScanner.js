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
    this.takePicture = this.takePicture.bind(this)
  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
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
