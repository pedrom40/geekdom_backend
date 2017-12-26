const mysql = require('mysql');
const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT} = require('./config');

const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  connectionLimit: 100,
  supportBigNumbers: true
});

// Get records from db
exports.getData = (sql, callback) => {

  // get a connection from the pool
  pool.getConnection( (err, connection) => {

    if (err) {
      console.log(err);
      callback(true);
    }

    // make the query
    connection.query(sql, (err, results) => {
      connection.release();

      if (err) {
        console.log(err);
        callback(true);
      }

      callback(false, results);

    });

  });

};
