'use strict';

require('dotenv').config();
const express     = require('express');
const morgan      = require('morgan');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const jsonParser  = bodyParser.json();
const upsAPI      = require('shipping-ups');
const mysql = require('mysql');

const app = express();

// setup routers
const {router: productsRouter} = require('./products/router');
app.use('/products/', productsRouter);


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

const {PORT} = require('./config');
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
