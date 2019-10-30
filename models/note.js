const conn = require('../database/connection');

module.exports = {
    get: ({spaceId}, callback) => {  
      console.log(`[Model.Note][Param:${spaceId}]`);
      const sql = 'SELECT id, timestamp, content FROM notes WHERE space_id = ?;';
      const arg = [spaceId];
      console.log(`[Model.Note][SQL:${sql}]`);
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