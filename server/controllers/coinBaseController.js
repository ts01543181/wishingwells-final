// const client = require('../Coinbase/index.js');
let Client = require('coinbase').Client;
const dotenv = require('dotenv').config();

let client = new Client({
  'apiKey': process.env.COINBASE_KEY,
  'apiSecret': process.env.COINBASE_SECRET,
});

module.exports = {
  addAWallet: (req, res) => {
    console.log('HEEEEERE')
    client.createAccount({'name': req.body.UID}, function(err, account) {
      client.getAccount(account.id, function(err, account) {
        account.createAddress(null, function(err, address) {
          res.send(address.address);
        });
      });
    })
  },
  buyCrypto: (req, res) => {
    console.log('COINBASE PATH', req.body);
    client.getAccounts({}, function(err, accounts) {
      let targetAccount = accounts.filter(function(acct) {
        return acct.name === req.body.uid;
      })
      // targetAccount[0].buy({'amount': '0.0003', 'currency': 'BTC'}, function(err, buy) {
      //   console.log(buy);
      // })
    });
  },
  getBitcoinValue: (req, res) => {
    console.log('we in hereereereree')
    let currencyCode = 'USD'
    client.getSpotPrice({'currency': currencyCode}, function(err, price) {
      console.log('Current bitcoin price in ' + currencyCode + ': ' +  price.data.amount);
      res.send(price.data.amount)
    });
  }
}
