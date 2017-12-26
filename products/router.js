const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

// pull in db connection
const db = require('../database');

// CORS
router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// GET: return all categories in use
router.get('/categories', jsonParser, (req, res) => {

  const sqlQuery = `
    SELECT 
      product_categories.id, 
      product_categories.name, 
      product_categories.img_src, 
      product_categories.short_desc
    FROM product_categories, products
    WHERE product_categories.active = 1
      AND product_categories.id = products.category_id
  `;

  db.getData(sqlQuery, (err, results) => {

    // on error
    if (err) {
      console.log(err);
      res.send(500, 'Internal Server Error');
    }

    // respond with results
    res.json(results);

  })

});


// export module
module.exports = {router};
