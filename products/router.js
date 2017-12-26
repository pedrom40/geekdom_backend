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

// GET: category id from name in url
router.get('/category/name/:name', (req, res) => {

  // return category id from name
  let sqlQuery = `
    SELECT id
    FROM product_categories
    WHERE name = "${req.params.name}"
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

  });

});

// GET: category name from the category id
router.get('/category/id/:id', (req, res) => {

  // return category id from name
  let sqlQuery = `
    SELECT name
    FROM product_categories
    WHERE id = "${req.params.id}"
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

  });

});

// GET: all products in this category
router.get('/category/:id', (req, res) => {

  // return category id from name
  let sqlQuery = `
    SELECT 
      	products.id,
        products.name,
        products.short_desc,
        products.category_id,
        products.image_id_list,
        product_categories.name AS categoryName
      FROM products, product_categories
      WHERE products.category_id = ${req.params.id}
      	AND product_categories.id = products.category_id
        AND products.active = 1
  `;

  db.getData(sqlQuery, (err, results) => {

    // on error
    if (err) {
      console.log(err);
      res.send(500, 'Internal Server Error');
    }

    // send main product details array
    res.json(results);

  });

});

// GET: main product image
router.get('/mainImg/:id', (req, res) => {

  // return category id from name
  let sqlQuery = `
    SELECT img_src
    FROM products_images
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

  });

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
