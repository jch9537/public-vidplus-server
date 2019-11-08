const conn = require('../database/connection');

module.exports = {
    get: ({userId}, callback) => {  
      const sql = `SELECT id, url, name, DATE_FORMAT(DATE_ADD(updatedAt, INTERVAL 9 HOUR), '%Y-%m-%d %h:%i %p') AS updatedAt FROM spaces, shared 
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
          sql = `SELECT id, url, name, DATE_FORMAT(DATE_ADD(updatedAt, INTERVAL 9 HOUR), '%Y-%m-%d %h:%i %p') AS updatedAt FROM spaces 
                 WHERE spaces.id = ${spaceId}`;
          conn.query(sql, (e3, r3) => {
            if (e3) return callback(e3, null);
            return callback(null, r3);
          });
        });
        return null;
      });
    },
    put: ({id, name, userId}, callback) => {
      let sql = `SELECT id FROM spaces WHERE id = ${id}`;
      conn.query(sql, (e1, r1) => {
        if (!r1.length) return callback(0, null);
        sql = `UPDATE spaces SET name = ? 
               WHERE id = (SELECT space_id FROM shared WHERE space_id = ? AND user_id = ?);`;
        const arg = [name, id, userId];
        conn.query(sql, arg, (e2, r2) => {
          if (e2) return callback(e2, null);
          if (r2.affectedRows === 0) return callback(1, null);
          sql = `SELECT id, url, name, DATE_FORMAT(DATE_ADD(updatedAt, INTERVAL 9 HOUR), '%Y-%m-%d %h:%i %p') AS updatedAt FROM spaces 
                 WHERE spaces.id = ${id}`;
          conn.query(sql, (e3, r3) => {
            if (e3) return callback(e3, null);
            return callback(null, r3);
          });     
          return null;   
        });
        return null;
      });
    },
    delete: ({id, userId}, callback) => {
      let sql = `SELECT id FROM spaces WHERE id = ${id}`;
      conn.query(sql, (e1, r1) => {
        if (!r1.length) return callback(0, null);
        sql = `DELETE FROM shared WHERE space_id = ? AND user_id = ?;`;
        let arg = [id, userId];
        conn.query(sql, arg, (e2, r2) => {
          if (e2) return callback(e2, null);
          if (r2.affectedRows === 0) return callback(1, null);
          sql = `DELETE FROM spaces WHERE id = ?;`;
          arg = [id];
          conn.query(sql, arg, (e3, r3) => {
            if (e3) return callback(e3, null);
            return callback(null, r3);
          });
          return null;
        });
        return null;
      });
    }
  }