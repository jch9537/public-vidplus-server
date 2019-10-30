const conn = require('../database/connection');

module.exports = {
    signup: ({email, password, name}, callback) => {  
      console.log(`[Model.User][Param:{${email}, ${password}, ${name}}]`);
      const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?);';
      const arg = [email, password, name];
      console.log(`[Model.User][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    signin: (args, callback) => {

    },
    signout: (args, callback) => {

    },
    get: (args, callback) => {

    },
    put: (args, callback) => {

    },
    delete: (args, callback) => {

    }
  }