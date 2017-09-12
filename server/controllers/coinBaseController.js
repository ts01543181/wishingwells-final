// const client = require('../Coinbase/index.js');
let Client = require('coinbase').Client;
const dotenv = require('dotenv').config();

let client = new Client({
  'apiKey': process.env.COINBASE_KEY,
  'apiSecret': process.env.COINBASE_SECRET,
});

module.exports = {
  addAWallet: (req, res) => {
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
      if (err) {
        console.log(err)
      }
      let targetAccount = accounts.filter(function(acct) {
        return acct.name === req.body.uid;
      })
      targetAccount[0].buy({'amount': req.body.amount, 'currency': 'USD'}, function(err, buy) {
        if (err) {
          console.log(err)
        }
        res.send(buy);
      })
    });
  },
  getBitcoinValue: (req, res) => {
    let currencyCode = 'USD'
    client.getSpotPrice({'currency': currencyCode}, function(err, price) {
      console.log('Current bitcoin price in ' + currencyCode + ': ' +  price.data.amount);
      res.send(price.data.amount)
    });
  },
  getWellTotal: (req, res) => {
    client.getAccounts({}, function(err, accounts) {
      if (err) {
        console.log(err)
      }
      let targetAccount = accounts.filter(function(acct) {
        return acct.name === req.body.uid;
      })
      res.send(targetAccount)
    });
  },
  cashOut: (req, res) => {
    console.log(req.body)

    client.getAccounts({}, function(err, accounts) {
      if (err) {
        console.log(err)
      }
      let targetAccount = accounts.filter(function(acct) {
        return acct.name === req.body.uid;
      })
      targetAccount[0].sendMoney({
        'to': req.body.to,
        'amount': req.body.amount,
        'currency': 'USD'}, function(err, tx) {
        if (err) {
          res.send('Error')
        }
        console.log(tx)
        res.send(tx)
      })
    });
  }
}
