const conn = require('../database/connection');

module.exports = {
    get: ({spaceId}, callback) => {  
      console.log(`[Model.Note][Param:${spaceId}]`);
      const sql = 'SELECT id, space_id, timestamp, content FROM notes WHERE space_id = ?;';
      const arg = [spaceId];
      console.log(`[Model.Note][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    post: ({spaceId, timestamp, content}, callback) => {
      console.log(`[Model.Note][Param:${spaceId}, ${timestamp}, ${content}]`);
      const sql = 'INSERT INTO notes (space_id, timestamp, content) VALUES (?, ?, ?);';
      const arg = [spaceId, timestamp, content];
      console.log(`[Model.Note][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    put: ({id, timestamp, content}, callback) => {
      console.log(`[Model.Note][Param:${id}, ${timestamp}, ${content}]`);
      const sql = 'UPDATE notes SET timestamp = ?, content = ? WHERE id = ?;';
      const arg = [timestamp, content, id];
      console.log(`[Model.Note][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    delete: ({id}, callback) => {
      console.log(`[Model.Note][Param:${id}]`);
      const sql = 'DELETE FROM notes WHERE id = ?;';
      const arg = [id];
      console.log(`[Model.Note][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    }
  }