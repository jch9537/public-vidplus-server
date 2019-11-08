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
      const sql = `SELECT id, url, name, DATE_FORMAT(DATE_ADD(updatedAt, INTERVAL 9 HOUR), '%Y-%m-%d %h:%i %p') AS updatedAt FROM spaces, shared  
                   WHERE spaces.id = shared.space_id AND spaces.id = ? AND shared.user_id = ?;`;
      const arg = [spaceId, userId];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    post: ({url, name, userId}, callback) => {
      let sql = `INSERT INTO spaces (url, name) VALUES (?, ?)`;
      let arg = [url, name];
      conn.query(sql, arg, (e1, r1) => {
        if (e1) return callback(e1, null);
        const spaceId = r1.insertId;
        sql = `INSERT INTO shared VALUES (?, ?);`;
        arg = [userId, spaceId];
        conn.query(sql, arg, (e2) => {
          if (e2) return callback(e2, null);
          return callback(null, spaceId);
        });
        return null;
      });
    },
    put: ({id, name, userId}, callback) => {
      const sql = `UPDATE spaces SET name = ? 
                   WHERE id = (SELECT space_id FROM shared WHERE space_id = ? AND user_id = ?);`;
      const arg = [name, id, userId];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    delete: ({id, userId}, callback) => {
      let sql = `DELETE FROM spaces WHERE id = ?;`;
      let arg = [id];
      conn.query(sql, arg, (e1) => {
        if (e1) return callback(e1, null);
        sql = `DELETE FROM shared WHERE space_id = ? AND user_id = ?;`;
        arg = [id, userId];
        conn.query(sql, arg, (e2, r2) => {
          if (e2) return callback(e2, null);
          return callback(null, r2);
        });
        return null;
      });
    }
  }