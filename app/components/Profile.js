import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const mapStateToProps = (state) => {
  return {
    username: state.ProfileReducer.username,
    firstname: state.ProfileReducer.firstname,
    lastname: state.ProfileReducer.lastname,
    email: state.ProfileReducer.email,
    photo: state.PhotoReducer.photo,
    bio: state.ProfileReducer.bio,
    logs: state.SavingsReducer.entries
  }
}

const rightButtonConfig = {
  title: 'Settings',
  handler() {
    Actions.Settings()
  },
  tintColor: 'black'
}

class Profile extends Component {
  constructor(props) {
    super(props)

    this.getTotal = this.getTotal.bind(this)
    this.invest = this.invest.bind(this)
  }

  invest() {
    alert('INVESTING')
  }

  getTotal() {
    let total = 0;
    for(let i = 0; i < this.props.logs.length; i++) {
      total += Number(this.props.logs[i]['amount'])
    }
    return total
  }

  render() {
    return (
      <View style={styles.body}>
          <View style={styles.navbar}>
            <NavigationBar title={{title:'Profile'}} rightButton={rightButtonConfig} tintColor='#99ccff'/>
          </View>
        <View>
            <Image source={{ uri: this.props.photo }} style={styles.image}>
          <View style={styles.namewrap}>
            <Text style={styles.name}>
              {this.props.firstname} {this.props.lastname}
            </Text>
          </View>
            </Image>
          <ScrollView>
          <Image source={require('../../assets/backgroundProfile.jpg')}  style={styles.backgroundImage}>
          <View style={styles.info}>
            <Text><Icon name='at' size={25} style={styles.icon}/> {this.props.username}</Text>
            <Text style={styles.email}><Icon name='email-outline' size={25} style={styles.icon}/> {this.props.email}</Text>
          </View>

          <View style={styles.info}>
              <Text style={styles.total}><Icon name='currency-usd' size={25} style={styles.icon}/>{this.getTotal()}</Text>
              <TouchableOpacity style={styles.button} onPress={this.invest}>
                <Text style={styles.invest}>INVEST</Text>
              </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.about}><Icon name='information-outline' size={25} style={styles.icon}/> A B O U T  M E</Text>
            <Text style={styles.bio}>{this.props.bio}</Text>
          </View>
        </Image>
        </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    // marginBottom: '55%'
  },
  navbar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex:2
  },
  about: {
    paddingTop: 15,
    marginLeft: 10,
    fontSize: 20
  },
  bio:{
    marginTop: 10,
    marginLeft: 15
  },
  image: {
    height: 250,
    width: 375,
    backgroundColor: '#C0C0C0',
  },
  namewrap: {
    marginLeft: 10,
    marginTop: 200,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  name: {
    paddingBottom: 20,
    fontSize: 30,
    top: 10,
    fontWeight: 'bold',
    // color: "#2eb8b8"
    color: 'white',
    shadowOpacity: 70
  },
  icon:{
    marginLeft: 30
  },
  info:{
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 7,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(242,242,242,0.4)',

  },
  bla:{
    flex: 1,
    flexDirection: 'row',
  },
  money:{
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 7,
    marginTop: 10,
    backgroundColor: 'rgba(242,242,242,0.4)',
  },
  button: {
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'grey',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 4,
    marginLeft: 220,
    height: 30
  },
  backgroundImage:{
    width: 375,
    height: 400,
    backgroundColor: 'rgba(0,0,0,0)'
  },
})

export default connect(mapStateToProps)(Profile)
