import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js';
import { connect } from 'react-redux'

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    visibleModal: null,
  };

  _renderButton = (text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>
        <Text style={styles.buttonText}>ADD TO WALLET</Text>
      </View>
    </TouchableOpacity>
  );

  _renderCloseButton = (text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>
        <Text>CLOSE</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>You want to save: ${this.props.amount}?</Text>
      <Text>Description: {this.props.description}</Text>
      {this._renderButton('Confirm', () => {
          this.setState({ visibleModal: null })
          this.props.addToWallet();
        })
      }
      {this._renderCloseButton('Close', () => this.setState({ visibleModal: null }))}
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this._renderButton("Add to Wallet", () => {
          (this.props.amount > 0 && this.props.description.length > 0) ? this.setState({ visibleModal: 1 }) : alert("Incorrect fields")
        })}
        <Modal isVisible={this.state.visibleModal === 1}>
          {this._renderModalContent()}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(92, 214, 214, 0.4)',  
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: 50,
    width: 350,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    fontSize: 15,
    color: 'grey'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default connect(null, { setUserInfo })(ConfirmModal)
