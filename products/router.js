const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const cors = require('cors');

// pull in db connection
const db = require('../database');

// CORS
router.use(cors());

// GET: return all categories in use
router.get('/categories', (req, res) => {

  // return all product categories in use
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

// GET: return all product details from id
router.get('/details/:id', (req, res) => {

  // return all main product details
  let sqlQuery = `
    SELECT id, name, sku, long_desc, image_id_list, media_id, finishing_id_list, size_id_list, flat_charge_id_list
    FROM products
    WHERE id = ${req.params.id}
      AND active = 1
  `;

  db.getData(sqlQuery, (err, results) => {

    // on error
    if (err) {
      console.log(err);
      res.send(500, 'Internal Server Error');
    }

    // send main product details array
    res.json(results);

  })

});


// export module
module.exports = {router};
