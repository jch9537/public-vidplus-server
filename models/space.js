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
        if (err) return callback(err, null);
        const spaceId = results.insertId;
        const sql = `INSERT INTO shared VALUES (?, ?);`;
        const arg = [userId, spaceId];
        console.log(`[Model.Space][2nd SQL:${sql}]`);
        conn.query(sql, arg, (err, results) => {
          if (err) callback(err, null);
          else callback(null, spaceId);
        });
      });
    },
    put: ({id, name}, callback) => {
      console.log(`[Model.Space][Param:${id}, ${name}]`);
      const sql = `UPDATE spaces SET name = ? WHERE id = ?;`;
      const arg = [name, id];
      console.log(`[Model.Space][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    delete: ({id, userId}, callback) => {
      console.log(`[Model.Space][Param:${id}, ${userId}]`);
      const sql = `DELETE FROM spaces WHERE id = ?;`;
      const arg = [id];
      console.log(`[Model.Space][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        const sql = `DELETE FROM shared WHERE space_id = ? AND user_id = ?;`;
        const arg = [id, userId];
        console.log(`[Model.Space][2nd SQL:${sql}]`);
        conn.query(sql, arg, (err, results) => {
          if (err) callback(err, null);
          else callback(null, results);
        });
      });
    }
  }