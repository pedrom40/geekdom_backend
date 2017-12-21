'use strict';

require('dotenv').config();
const express     = require('express');
const morgan      = require('morgan');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const jsonParser  = bodyParser.json();
const upsAPI      = require('shipping-ups');
const mysql       = require('mysql');

const app = express();


// log the http layer
app.use(morgan('common'));

// CORS
app.use(cors({ origin: '*' }));


// setup ups
const {UPS_USERNAME, UPS_PASSWORD, UPS_ACCESS_KEY} = require('./config');
const ups = new upsAPI({
  environment: 'live', // or sandbox
  username: UPS_USERNAME,
  password: UPS_PASSWORD,
  access_key: UPS_ACCESS_KEY,
  imperial: true // set to false for metric
});

// validate address
app.get('/validateAddress', (req, res) => {

  // pass to ups api
  ups.address_validation({
    name: req.query.customerName,
    address_line_1: req.query.address,
    city: req.query.city,
    state_code: req.query.state,
    postal_code: req.query.zip,
    country_code: req.query.countryCode
  }, function(err, response) {

    // handle errors
    if(err) {console.log(err);}

    // send it back
    res.json(response);

  });

});

// get shipping rate
app.get('/getShippingRates', (req, res) => {

  // pass to ups api
  ups.rates({
    shipper: {
      name: 'BannerStack',
      address: {
        address_line_1: '53 Camellia Way',
        city: 'San Antonio',
        state_code: 'TX',
        country_code: 'US',
        postal_code: '78209'
      }
    },
    ship_to: {
      name: req.query.customerName,
      address: {
        address_line_1: req.query.address,
        city: req.query.city,
        state_code: req.query.state,
        postal_code: req.query.zip,
        country_code: req.query.countryCode
      }
    },
    packages: [
      {
        description: 'My Package',
        weight: req.query.pkgWeight
      }
    ]
  }, function(err, response) {

    // handle errors
    if(err) {return console.log(err);}

    // send response
    res.json(response);

  });

});


// setup server
let server;
const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT, PORT} = require('./config');
const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT
});

function runServer() {
  return new Promise((resolve, reject) => {
    connection.connect(function(err){
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        });
        connection.on('error', err => {
          connection.end();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return connection.end().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
