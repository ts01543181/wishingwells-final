import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js';
import { connect } from 'react-redux'

class CashOutModal extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    visibleModal: null,
    amount: '',
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
      <Text>You want to Cash Out: </Text>
      <TextInput style={styles.amountInputField} placeholder="Amount here" placeholderTextColor={'#A8A8A8'} keyboardType={'numeric'} multiline={true} onChangeText={(text) => this.setState({amount: text})} value={String(this.state.amount)}/>
      {this._renderButton('Confirm', () => {
         (Number(this.state.amount) > this.props.wellAmount) ? alert('Invalid input') : this.setState({ visibleModal: null, amount: '' })
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
    backgroundColor: 'lightgrey',
    marginTop: 30,
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
    height: '15%',
    borderColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
});

export default connect(null, { setUserInfo })(CashOutModal)
