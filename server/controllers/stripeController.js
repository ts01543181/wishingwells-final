const dotenv = require('dotenv').config();
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


module.exports = {
  addACard: (req, res) => {
    stripe.tokens.create({
      card: {
        "number": req.body.number,
        "exp_month": req.body.exp_month,
        "exp_year": req.body.exp_year,
      }
    }, function(err, token) {
      if (err) {
        console.log(err);
      } else {
        stripe.customers.create({
          description: 'new stripe customer',
          source: token.id // obtained with Stripe.js
        }, function(err, customer) {
          if (err) {
            console.log(err);
          } else {
            res.send(customer.id)
          }
        });
      }
    })
  },
  makePayment: (req, res) => {
    console.log('REQ BODY', req.body)
    // stripe.charges.create({
    //   amount: req.body.amount,
    //   currency: 'usd',
    //   customer: req.body.cardID,
    // })
    // .then(data => {
    //   console.log(data)
    // })
    res.send('Payment complete.')
  }
}
