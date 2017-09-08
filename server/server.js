const express = require('express');
const path = require('path');
const parser = require('body-parser');
const dotenv = require('dotenv').config();

const router = require('./routes/router.js');

let app = express();
let PORT = process.env.PORT || 4000;

app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())

app.use('/api', router)

app.listen(PORT, () => {
  console.log('Listening on port, ', PORT);
})
