import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import * as firebase from 'firebase'
import moment from 'moment'
import { connect } from 'react-redux'
import { setSavings } from '../../Actions/Savings/SavingsAction'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
import axios from 'axios'
import { HOST_IP } from '../../../config.js'
const db = firebase.database()

const mapStateToProps = (state) => {
  return {
    uid: state.ProfileReducer.uid,
  }
}

class WellLogs extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    onSwipe: PropTypes.func.isRequired,
  };

  constructor() {
    super()
    this.state = {
      refreshing: false,
      wellSavings: '',
    };
  }

  componentDidMount() {

    axios.post(`http://${HOST_IP}:4000/api/getWellTotal`, {uid: this.props.uid})
    .then(({ data }) => {
      this.setState({
        wellSavings: data[0].native_balance.amount
      })
    })
  }

  _onRefresh() {
    this.setState({refreshing: true});
    db.ref(`users/${this.props.uid}/logs`).on('value', (snapshot) => {
      (snapshot.val()) ? this.props.setSavings(Object.values(snapshot.val())) : null;
    })
    this.setState({refreshing: false});
  }

  render() {

    const { onSwipe } = this.props;

    return (
      <Image source={require('../../../assets/QRbackground.jpg')}  style={styles.backgroundImage}>
        <View style={styles.navbar}>
          <NavigationBar title={{title:'SAVINGS', tintColor:"white"}} tintColor='rgba(240, 240, 240, 0.1)'/>
        </View>
        <View style={styles.pageButtons}>
          <TouchableOpacity style={styles.button} onPress={onSwipe}>
            <Text style={styles.buttonText}>Wallet Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Well Logs</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.total}>
          <Text style={styles.number}>${this.state.wellSavings}</Text>
          <Text style={styles.savings}>Current Well Savings</Text>
        </View>

        <View style={styles.transactions}>
          <Text style={styles.transText}>SAVINGS LOG</Text>
        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  pageButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    padding: 5,
    borderRadius: 5,
    borderColor: '#aaa',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10
  },
  buttonText: {
    fontSize: 15,
  },
  nav:{
    color: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: 800,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  transactions: {
    marginTop: 20,
    marginBottom: 8,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: 'white',
    paddingBottom: 0
  },
  transText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  },
  // navbar: {
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.8,
  //   shadowRadius: 2,
  //   zIndex:2
  // },
  list: {
    backgroundColor: 'rgba(242,242,242,0.3)',
    borderRadius: 15,
    marginBottom: 5,
    height: 80,
    marginLeft: 10,
    marginRight: 10
  },
  description: {
    fontSize: 20,
    top: 5,
    marginLeft: 10,
  },
  time: {
    marginRight: 10,
    color: 'gray',
    top: 10,
  },
  firstline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  amount: {
    textAlign: 'right',
    alignSelf: 'stretch',
    fontSize: 20,
    marginBottom: 3,
    marginRight: 10,
    marginTop: 4
  },
  date: {
    marginLeft: 10,
    top: 5,
    color: 'gray',
  },
  log : {
    marginBottom: '70%',
  },
  total: {
    alignItems: 'center',
    height: 100,
    width: 380,
    backgroundColor: 'rgba(242,242,242,0.3)',
    borderRadius: 15,
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18
  },
  savings: {
    fontSize: 20,
    marginLeft: 7,
    color: 'black'
  },
  number: {
    fontSize: 40,
    textAlign: 'right',
    marginRight: 10,
    color: 'black',
    marginBottom: 10,
    marginTop: 10
  },
});

export default connect(mapStateToProps, { setSavings, setUserInfo })(WellLogs)
