const conn = require("../database/connection");

module.exports = {
  get: ({ spaceId, userId }, callback) => {
    const sql = `SELECT id, space_id, timestamp, content FROM notes 
                   WHERE space_id = (SELECT space_id FROM shared WHERE space_id = ? AND user_id = ?);`;
    const arg = [spaceId, userId];
    conn.query(sql, arg, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  },
  post: ({ spaceId, timestamp, content }, callback) => {
    const sql = `INSERT INTO notes (space_id, timestamp, content) VALUES (?, ?, ?);`;
    const arg = [spaceId, timestamp, content];
    conn.query(sql, arg, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  },
  put: ({ userId, id, spaceId, timestamp, content }, callback) => {
    let sql = `SELECT id FROM notes WHERE id = ${id};`;
    conn.query(sql, (e1, r1) => {
      if (e1) return callback(e1, null);
      if (!r1.length) return callback(0, null);
      sql = `SELECT user_id FROM shared 
             WHERE user_id = ${userId} AND space_id = ${spaceId};`;      
      conn.query(sql, (e2, r2) => {
        if (e2) return callback(e1, null);
        if (!r2.length) return callback(1, null);
        sql = `UPDATE notes SET timestamp = ?, content = ?, space_id = ? WHERE id = ?;`;
        let arg = [timestamp, content, spaceId, id];
        conn.query(sql, arg, (e3, r3) => {
          if (e3) return callback(e3, null);
          return callback(null, r3);
        });
        return null;
      });
      return null;
    });
  },
  delete: ({ id, userId }, callback) => {
    let sql = `SELECT id FROM notes WHERE id = ${id};`;
    conn.query(sql, (e1, r1) => {
      if (e1) return callback(e1, null);
      if (!r1.length) return callback(0, null);
      sql = `SELECT user_id FROM shared
             WHERE user_id = ${userId} AND space_id = (SELECT space_id FROM notes WHERE id = ${id});`
      conn.query(sql, (e2, r2) => {
        if (e2) return callback(e2, null);
        if (!r2.length) return callback(1, null);
        sql = `DELETE FROM notes WHERE id = ${id};`;
        conn.query(sql, (e3, r3) => {
          if (e3) return callback(e3, null);
          return callback(null, r3);
        });
        return null;
      });
      return null;
    });
  }
};
