import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Login from './app/components/Login'
import Landing from './app/components/LandingPage'
import LogHistory from './app/components/LogHistory/LogHistory'
import QR from './app/components/QR/QR'
import Profile from './app/components/Profile/Profile'
import Settings from './app/components/Settings'
import Well from './app/components/Wells/Well'
import DonationWell from './app/components/Wells/DonationWell'
import DonationProfile from './app/components/Wells/DonationProfile'
import AddCard from './app/components/UserAuth/AddCard'
import QRScanner from './app/components/QR/QRScanner'
import Invest from './app/components/Wells/Invest'


import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Register from './app/components/Register'
import reducers from './app/Reducers/index'

console.disableYellowBox = true;
const store = createStore(reducers)

class TabIcon extends Component {
  render() {
    return (
      <View style={{flex:1, flexDirection:'row', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon name={this.props.iconName || "circle"} size={27}/>
        <Text style={{fontSize: 12}}>{this.props.title}</Text>
      </View>
    );
  }
}
class CustomIcon extends Component {
  render() {
    return (
      <View style={{flex:1, flexDirection:'row', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Image source={require('./assets/icon.png')} style={styles.icon}/>
        <Text style={{fontSize: 12}}>{this.props.title}</Text>
      </View>
    );
  }
}

export default class WishingWell extends Component {

  render() {
    return (
    <Provider store={store}>
      <Router>
        <Scene key="root" >
          <Scene key="Login" component={Login} initial panHandler={null} hideNavBar/>
          <Scene key="Register" component={Register} hideNavBar/>
          <Scene key="tabbar" tabs={true} tabBarStyle={{ backgroundColor: '#FFFFFF' }}>
            <Scene key="Home" component={Landing} iconName="home" icon={TabIcon} panHandler={null} hideNavBar/>
            <Scene key="QR" component={QR} iconName="qrcode" icon={TabIcon} panHandler={null} hideNavBar/>
            <Scene key="Well" component={Well} icon={CustomIcon} panHandler={null} hideNavBar/>
            <Scene key="Log" component={LogHistory} iconName="format-list-bulleted" icon={TabIcon} panHandler={null} hideNavBar/>
            <Scene key="Profile" component={Profile} iconName="account-outline" icon={TabIcon} panHandler={null} hideNavBar/>
          </Scene>
            <Scene key="Settings" component={Settings} panHandler={null} hideNavBar/>
            <Scene key="AddCard" component={AddCard} title="AddCard" panHandler={null} />
            <Scene key="QRScanner" component={QRScanner} title="QRScanner" panHandler={null} />
            <Scene key="DonationWell" component={DonationWell} title="DonationWell" panHandler={null} />
            <Scene key="DonationProfile" component={DonationProfile} title="DonationProfile" panHandler={null} />
            <Scene key="Invest" component={Invest} title="Invest" panHandler={null} />
        </Scene>
      </Router>
    </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '20%',
  },
  title: {
    fontWeight: 'bold'
  },
  inputFields: {
    borderWidth: 1,
    width: '50%',
    marginTop: 20
  },
  credentials: {
    paddingTop: 20
  },
  icon: {
    width: '38%',
    resizeMode: 'contain'
  }
});

// AppRegistry.registerComponent('WishingWell', () => WishingWell);
AppRegistry.registerComponent('newwishingwell', () => WishingWell);
