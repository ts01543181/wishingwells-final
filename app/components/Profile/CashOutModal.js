import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js';
import { connect } from 'react-redux'
import axios from 'axios'
import {HOST_IP} from '../../../config.js'

class CashOutModal extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    visibleModal: null,
    amount: '',
    walletAddress: ''
  };

  _renderButton = (text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>
        <Text style={styles.buttonText}>Cash Out Well</Text>
      </View>
    </TouchableOpacity>
  );

  _renderCloseButton = (text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>
        <Text>Close</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Please note: There is a small transaction fee needed (~1-2 USD).</Text>
      <Text></Text>
      <Text>You want to Cash Out: </Text>
      <TextInput style={styles.amountInputField} placeholder="Amount here" placeholderTextColor={'#A8A8A8'} keyboardType={'numeric'} multiline={true} onChangeText={(text) => this.setState({amount: text})} value={String(this.state.amount)}/>
      <Text>Wallet Address: </Text>
      <TextInput style={styles.addressInputField} placeholder="Address here" placeholderTextColor={'#A8A8A8'} multiline={true} onChangeText={(text) => this.setState({walletAddress: text})} value={this.state.walletAddress}/>

      {this._renderButton('Confirm', () => {
        if (Number(this.state.amount) > this.props.wellAmount) {
          alert('Invalid input')
        } else {
          let cashOutObj = {
            to: this.state.walletAddress,
            amount: this.state.amount - 2,
            uid: this.props.uid
          }
          if (this.state.amount >= 3) {
            // axios.post(`http://${HOST_IP}:4000/api/cashOut`, cashOutObj)
            // .then(({data}) => {
            //   if (data === 'Error') {
            //     alert('Insufficient funds')
            //   }
            // })
            alert('Cashed Out!')
          } else {
            alert('Input must be larger than $5.00')
          }
          this.setState({ visibleModal: null, amount: '', walletAddress: '' })
        }
      })
      }
      {this._renderCloseButton('Close', () => this.setState({ visibleModal: null }))}
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this._renderButton("Cash Out Well", () => {
          this.setState({ visibleModal: 1 })
        })}
        <Modal isVisible={this.state.visibleModal === 1}>
          {
            this._renderModalContent()
          }
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
    backgroundColor: 'lightgrey',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 50,
    width: 350,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    fontSize: 20
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
  amountInputField: {
    width: '100%',
    height: '10%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  addressInputField: {
    width: '100%',
    height: '10%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  }
});

export default connect(null, { setUserInfo })(CashOutModal)
