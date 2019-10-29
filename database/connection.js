const mysql = require('mysql');

const conn = mysql.createConnection({
  user: 'root',
  password: 'vidplus',
  database: 'vidplus'
});
conn.connect();

module.exports = conn;