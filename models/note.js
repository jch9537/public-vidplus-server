const conn = require('../database/connection');

module.exports = {
    get: ({spaceId, userId}, callback) => {  
      const sql = `SELECT id, space_id, timestamp, content FROM notes 
                   WHERE space_id = (SELECT space_id FROM shared WHERE space_id = ? AND user_id = ?);`;
      const arg = [spaceId, userId];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    post: ({spaceId, timestamp, content}, callback) => {
      const sql = `INSERT INTO notes (space_id, timestamp, content) VALUES (?, ?, ?);`;
      const arg = [spaceId, timestamp, content];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    put: ({id, timestamp, content}, callback) => {
      const sql = `UPDATE notes SET timestamp = ?, content = ? WHERE id = ?;`;
      const arg = [timestamp, content, id];
      conn.query(sql, arg, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
      });
    },
    delete: ({id, userId}, callback) => {
      let sql = `SELECT user_id FROM shared 
                 WHERE user_id = ? AND space_id = (SELECT space_id FROM notes WHERE id = ?);`;
      let arg = [userId, id];
      conn.query(sql, arg, (e1, r1) => {
        if (e1) return callback(e1, null);
        if (!r1.length) return callback(0, null);
        sql = 'DELETE FROM notes WHERE id = ?;';
        arg = [id];
        conn.query(sql, arg, (e2, r2) => {
          if (e2) return callback(e2, null);
          return callback(null, r2);
        });
        return null;
      });
    }
  }