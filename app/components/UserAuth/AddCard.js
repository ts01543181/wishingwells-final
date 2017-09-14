import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Button, Icon } from 'react-native';
import { Form, Separator, InputField } from 'react-native-form-generator';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import axios from 'axios';
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js';
import { CreditCardInput } from "react-native-credit-card-input";
import { HOST_IP } from '../../../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const db = firebase.database()

const mapStateToProps = (state) => {
 return {
   username: state.ProfileReducer.username,
   firstname: state.ProfileReducer.firstname,
   lastname: state.ProfileReducer.lastname,
   email: state.ProfileReducer.email,
   uid: state.ProfileReducer.uid,
   investments: state.ProfileReducer.investments
 }
}

class AddCard extends Component {

 constructor(props) {
   super(props);
   this.state = {
     formData: {},
     phoneNumber: ''
   }
   this.addACard = this.addACard.bind(this)
   this.handleFormChange = this.handleFormChange.bind(this)
 }

 handleFormChange(formData){
   this.state.formData= formData

 }

 addACard() {
     if (this.state.phoneNumber.length < 10) {
       alert('Please enter a valid phone number')
       return
     }
     if (this.state.formData.valid === true) {
       let cardInfo = {
         number: this.state.formData.values.number,
         exp_month: +this.state.formData.values.expiry.slice(0,2),
         exp_year: +this.state.formData.values.expiry.slice(3)
       }
       axios.post(`http://${HOST_IP}:4000/api/addACard`, cardInfo)
       .then(({ data }) => {
         db.ref('users/' + this.props.uid).update({
           cardID: data
         });
         this.props.setUserInfo({
           cardID: data
         });
       })
       .then(() => {
         let userUID = this.props.uid;
         db.ref('users/' + userUID).once('value')
         .then(data => {
           if (!data.val().wallet) {
             axios.post(`http://${HOST_IP}:4000/api/addAWallet`, {UID: userUID})
             .then(({ data }) => {
               db.ref('users/' + userUID).update({
                 wallet: data,
                 phoneNumber: this.state.phoneNumber,
               });
               this.props.setUserInfo({
                 qr: data
               });
             });
             alert('Added a Wallet!')
           }  else {
             alert('Wallet already added')
           }
         });
       })
     } else {
       Alert.alert('Invalid card information!')
     }
 }

 // addAWallet() {
 //   let userUID = this.props.uid;
 //   db.ref('users/' + userUID).once('value')
 //   .then(data => {
 //     if (!data.val().wallet) {
 //       axios.post(`http://${HOST_IP}:4000/api/addAWallet`, {UID: userUID})
 //       .then(({ data }) => {
 //         db.ref('users/' + userUID).update({
 //           wallet: data,
 //         });
 //         this.props.setUserInfo({
 //           qr: data
 //         });
 //       });
 //       alert('Added a Wallet!')
 //     }  else {
 //       alert('Wallet already added')
 //     }
 //   });
 // }

 render() {
   return (
     <KeyboardAwareScrollView>
     <View>
       <View style={styles.placeholder}></View>
       <View style={styles.phoneInput}>
         <Text style={styles.phoneText}>Phone Number: </Text>
         <TextInput placeholder="10-digit Number" keyboardType="numeric" style={styles.phoneInputAmount} maxLength={10} onChangeText={(text) => this.setState({phoneNumber: text})} value={this.state.phoneNumber}></TextInput>
       </View>
       <CreditCardInput onChange={this.handleFormChange}/>
       <View style={styles.buttonPlaceholder}></View>
       <Button style={styles.button} title="Submit" onPress={this.addACard}></Button>
     </View>
    </KeyboardAwareScrollView>
   )
 }
}

const styles = StyleSheet.create({
 placeholder: {
   marginTop: '15%',
   alignItems: 'center',
 },
 buttonPlaceholder: {
   marginTop: '5%'
 },
 phoneInput: {
   flexDirection: 'row',
   marginLeft: '17%',
   marginBottom: '10%',
 },
 phoneInputAmount: {
   justifyContent: 'center',
   textAlign: 'center',
   marginLeft: '5%'
 },
 phoneText: {
   fontWeight: 'bold'
 }
})

export default connect(mapStateToProps, { setUserInfo })(AddCard)
