const conn = require('../database/connection');

module.exports = {
    get: ({userId}, callback) => {  
      console.log(`[Model.Space][Param:${userId}]`);
      const sql = `SELECT id, url, name FROM spaces, shared 
                   WHERE spaces.id = shared.space_id AND shared.user_id = ?;`;
      const arg = [userId];
      console.log(`[Model.Space][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });  
    },
    getOne: ({spaceId}, callback) => {
      console.log(`[Model.Space][Param:${spaceId}]`);
      const sql = `SELECT id, url, name FROM spaces WHERE id = ?;`;
      const arg = [spaceId];
      console.log(`[Model.Space][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    post: ({url, name, userId}, callback) => {
      console.log(`[Model.Space][Param:${url}, ${name}, ${userId}]`);
      const sql = `INSERT INTO spaces (url, name) VALUES (?, ?)`;
      const arg = [url, name];
      console.log(`[Model.Space][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else {
          const spaceId = results.insertId;
          const sql = `INSERT INTO shared VALUES (?, ?);`;
          const arg = [userId, spaceId];
          conn.query(sql, arg, (err, results) => {
            if (err) callback(err, null);
            else callback(null, spaceId);
          });
        }
      });
    },
    put: (args, callback) => {},
    delete: (args, callback) => {}
  }