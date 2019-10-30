const conn = require('../database/connection');

module.exports = {
    get: (args, callback) => {  

    },
    getOne: ({spaceId}, callback) => {
      console.log(`[Model.Space][Param:${spaceId}]`);
      const sql = 'SELECT id, url, name FROM spaces WHERE id = ?;';
      const arg = [spaceId];
      console.log(`[Model.Space][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    post: (args, callback) => {

    },
    put: (args, callback) => {

    },
    delete: (args, callback) => {

    }
  }