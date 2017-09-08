var Client = require('coinbase').Client;

var coinbaseKeys = require('../../config')

let client = new Client({
  'apiKey': coinbaseKeys.APIKey,
  'apiSecret': coinbaseKeys.APISecret,
});

module.exports = {
  client,
}
