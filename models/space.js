const conn = require('../database/connection');

module.exports = {
    get: ({userId}, callback) => {  
      const sql = `SELECT id, url, name, DATE_FORMAT(updatedAt, '%r') AS updatedAt FROM spaces, shared 
                   WHERE spaces.id = shared.space_id AND shared.user_id = ?;`;
      const arg = [userId];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });  
    },
    getOne: ({spaceId, userId}, callback) => {
      const sql = `SELECT id, url, name, DATE_FORMAT(updatedAt, '%r') AS updatedAt FROM spaces, shared  
                   WHERE spaces.id = shared.space_id AND spaces.id = ? AND shared.user_id = ?;`;
      const arg = [spaceId, userId];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    post: ({url, name, userId}, callback) => {
      const sql = `INSERT INTO spaces (url, name) VALUES (?, ?)`;
      const arg = [url, name];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        const spaceId = results.insertId;
        const sql2 = `INSERT INTO shared VALUES (?, ?);`;
        const arg2 = [userId, spaceId];
        conn.query(sql2, arg2, (err2, results) => {
          if (err2) return callback(err2, null);
          return callback(null, spaceId);
        });
      });
    },
    put: ({id, name, userId}, callback) => {
      const sql = `UPDATE spaces SET name = ? WHERE id = (SELECT space_id FROM shared WHERE space_id = ? AND user_id = ?);`;
      const arg = [name, id, userId];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    delete: ({id, userId}, callback) => {
      const sql = `DELETE FROM spaces WHERE id = ?;`;
      const arg = [id];
      conn.query(sql, arg, (err) => {
        if (err) return callback(err, null);
        const sql2 = `DELETE FROM shared WHERE space_id = ? AND user_id = ?;`;
        const arg2 = [id, userId];
        conn.query(sql2, arg2, (err2, results2) => {
          if (err2) return callback(err2, null);
          return callback(null, results2);
        });
      });
    }
  }