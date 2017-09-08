import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native'
import NavigationBar from 'react-native-navbar'
import * as firebase from 'firebase'
import moment from 'moment'
import { connect } from 'react-redux'
import { setSavings } from '../Actions/Savings/SavingsAction'
const db = firebase.database()


const mapStateToProps = (state) => {
  return {
    logs: state.SavingsReducer.entries,
    uid: state.ProfileReducer.uid
  }
}

class LogHistory extends Component {
  constructor() {
    super()
    this.state = {
      refreshing: false,
    };
    this.getTotal = this.getTotal.bind(this)
  }

  componentWillMount(){
    db.ref(`users/${this.props.uid}/logs`).on('value', (snapshot) => {
      (snapshot.val()) ? this.props.setSavings(Object.values(snapshot.val())) : null;
    })
  }
  getTotal() {
    let total = 0;
    for(let i = 0; i < this.props.logs.length; i++) {
      total += Number(this.props.logs[i]['amount'])
    }
    return total
  }

  _onRefresh() {
    this.setState({refreshing: true});
    db.ref(`users/${this.props.uid}/logs`).on('value', (snapshot) => {
      (snapshot.val()) ? this.props.setSavings(Object.values(snapshot.val())) : null;
    })
    this.setState({refreshing: false});
  }

  render() {

    return (
      <View>
        <View style={styles.navbar}>
          <NavigationBar title={{title:'Savings'}} tintColor='#99ccff'/>
        </View>
        <View style={styles.total}>
          <Text style={styles.savings}>Total Well Savings: <Text style={styles.number}>${this.getTotal()}</Text></Text>
        </View>
            <View style={styles.log}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    />}
                removeClippedSubviews={false}
                data={this.props.logs.reverse()}
                renderItem={({item}) =>
                  <View style={styles.list}>

                    <View style={styles.firstline}>
                      <Text style={styles.description}>{item.description}</Text>
                      <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                    </View>

                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.amount}>${item.amount}</Text>
                  </View>
                }
                style={{height:'100%'}}
              />
              </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navbar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex:2
  },
  list: {
    borderBottomWidth: 0.3,
    borderColor: 'gray',
    width: '100%',
    height: 80,
  },
  description: {
    fontSize: 20,
    top: 5,
    marginLeft: 10,
  },
  amount: {
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
    marginBottom: '55%'
  },
  total: {
    height: 40,
    borderBottomWidth: 0.5,
    borderColor: 'gray', 
  },
  savings: {
    fontSize: 25,
    marginLeft: 7,

  },
  number: {
    fontSize: 25,
    textAlign: 'right',
    marginRight: 10
  },
})

export default connect(mapStateToProps, { setSavings })(LogHistory)
