import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput,  ImagePickerIOS} from 'react-native';
import { Form, Separator, InputField, LinkField, SwitchField, PickerField} from 'react-native-form-generator';
import { connect } from 'react-redux';
import { setUserInfo } from '../Actions/Profile/ProfileAction'
import { setUserPhoto } from '../Actions/Profile/PhotoAction'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as firebase from 'firebase'
import { amazonKey, amazonSecret } from '../../config'
import ImagePicker from 'react-native-image-picker'
// import RNFetchBlob from 'react-native-fetch-blob'
import * as Progress from 'react-native-progress'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions } from 'react-native-router-flux'

const storage = firebase.storage()
// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs 
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob


const mapStateToProps = (state) => {
  return {
    username: state.ProfileReducer.username,
    firstname: state.ProfileReducer.firstname,
    lastname: state.ProfileReducer.lastname,
    email: state.ProfileReducer.email,
    photo: state.PhotoReducer.photo,
    bio: state.ProfileReducer.bio,
    uid: state.ProfileReducer.uid,
    photo: state.PhotoReducer.photo
  }
}


class Settings extends Component {
  static navigationOptions = {
    title: 'Settings'
  };
  constructor(props) {
    super(props)
    this.state={
      photo: null,
      formData: {},
      uploading: false,
      progress: 0
    }

    this.handleOnSave = this.handleOnSave.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this._pickImage = this._pickImage.bind(this)
  }

  componentWillMount() {
   storage.ref(`profile_pics/${this.props.uid}`)
  }

  handleFormChange(formData){
    this.state.formData = formData
  }

  handleOnSave() {
    this.props.setUserInfo(this.state.formData)
    if (this.state.photo === null && this.props.photo) {
      this.setState({
        photo: this.props.photo
      })
    } else {
      this.props.setUserPhoto(this.state.photo)
    } 
    firebase.database().ref(`users/${this.props.uid}`).update({
      username: this.state.formData.username || this.props.username,
      firstname: this.state.formData.firstname || this.props.firstname,
      lastname: this.state.formData.lastname || this.props.lastname,
      email: this.state.formData.email || this.props.email,
      bio: this.state.formData.bio || this.props.bio,
      photo: this.state.photo || this.props.photo
    })
  }
  
  signOut() {
    firebase.auth().signOut().then(() => {
      Actions.Login()
    })
  }

  _pickImage() {
    ImagePicker.showImagePicker(null, (res) => {
      // if (!res.didCancel) {
      //   const uploadImage = (uri, mime = 'application/octet-stream') => {
      //     return new Promise((resolve, reject) => {
      //       const uploadUri = uri.replace('file://', '')
      //         let uploadBlob = null
      //         const imageRef = storage.ref('profile_pics').child(`${this.props.uid}`)

      //         fs.readFile(uploadUri, 'base64')
      //         .then((data) => {
      //           return Blob.build(data, { type: `${mime};BASE64` })
      //         })
      //         .then((blob) => {
      //           uploadBlob = blob
      //           const task = imageRef.put(blob, { contentType: mime })

      //           task.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      //             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //             if (progress <= 100) {
      //               console.log('Upload is ' + progress + '% done');
      //             }
      //           }, (err) => {
      //             console.log(err)
      //           }, 
      //           () => {
      //             this.props.setUserPhoto(task.snapshot.downloadURL)
      //           })
      //         })
      //     })
      //   }
      //   uploadImage(res.uri)
      // }
    })
  }

  render() {
    let { photo } = this.state;
    return this.state.uploading ? (<Progress.Pie size={50} />) : (
      <KeyboardAwareScrollView>
      <View>
       <View style={styles.body}>
          <Image source={{ uri: photo || this.props.photo }} onPress={this._pickImage} style={styles.image} />
        <Button
            title="Change Profile Photo"
            onPress={this._pickImage}
            style={styles.button}
            color="#2eb8b8" 
        />
        </View>
        <Separator label="Personal Information"/>
       <Form
          style={styles.form}
          ref='personalInformation'
          onChange={this.handleFormChange}
          label="Personal Information" >

        <InputField
            ref='username'
            placeholder='Username'
            value={this.props.username}
            iconLeft={<Icon name='account-circle' size={30} style={styles.icon}/>}
          />


         <InputField
            ref='firstname'
            placeholder='First Name'
            value={this.props.firstname}
            iconLeft={<Icon name='account' size={30} style={styles.icon}/>}
          />

        <InputField
            ref='lastname'
            placeholder='Last Name'
            value={this.props.lastname}
            iconLeft={<Icon name='account' size={30} style={styles.icon}/>}
          />
        <InputField
            ref='email'
            iconLeft={<Icon name='email-outline' size={30} style={styles.icon}/>}
            placeholder='Email'
            value={this.props.email}
          />
        <InputField
            ref='bio'
            iconLeft={<Icon name='information-outline' size={30} style={styles.icon}/>}
            placeholder='Add a bio to your profile'
            value={this.props.bio}
          />
        <Separator label="Private Information"/>
        <LinkField 
          iconLeft={<Text style={styles.cardtext}>Add Credit Card</Text>}
          onPress={()=>Actions.AddCard()}
          iconRight={<Icon name='chevron-right' size={30} style={styles.icon}/>}
        />
        </Form>

        <Button
          title="Save Changes"
          onPress={() => this.handleOnSave()}
          style={styles.button}
          color="#2eb8b8" 
        ></Button>
        <Button
          title="Sign Out"
          onPress={() => this.signOut()}
          style={styles.button}
          color="#2eb8b8" 
        ></Button>

      </View>
        </KeyboardAwareScrollView>

    );
  }
};

const styles = StyleSheet.create({
  body: {
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 100,
    borderRadius: 50,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#C0C0C0'
  },
  icon: {
    marginTop: 7,
    marginLeft: 10,
    color:'gray'
  },
  button:{
    marginTop: 15
  },
  cardtext: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10
  }
});

export default connect(mapStateToProps, { setUserInfo, setUserPhoto })(Settings);
