const conn = require('../database/connection');

module.exports = {
    signup: ({email, password, name}, callback) => { 
      // console.log(`[Model.User][Param:{${email}, ${password}, ${name}}]`);
      const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?);';
      const arg = [email, password, name];
      // console.log(`[Model.User][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    //구분해서 에러반환 있으면 사용중인 이메일이라고 알려주고 에러메세지로 구분 401이메일 중복 등...
    //쿼리문으로 select로 먼저 날리고 있으면 중복에러메세지 띄우고 없으면 등록
    signin: ({email, password}, callback) => {
      const sql = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`
      conn.query(sql, (err, results) => {
        if(err) callback(err, null);
        else(callback(null, results))
      })
    },
    get: (id, callback) => {
      const sql = `SELECT * FROM users WHERE id='${id}'`;
      // console.log('에스큐엘 :', sql)
      conn.query(sql, (err, result) => {
        if(err){
          callback(err, null);
        } else callback(null, result);
      });
    },
    put: ({email, password, name}, callback) => {
      let sql = `UPDATE users SET password='${password}', name='${name}' WHERE email='${email}';`
      conn.query(sql, (err, results) => {
        if(err) callback(err, null);
        else callback(null, results);
      })
    },
    delete: (id, callback) => {
      //아래 let과 const에 대해서 
      let sql =  `DELETE FROM users WHERE id='${id}';`
      conn.query(sql, (err, results) => {
        if(err) callback(err, null);
        else {
          sql = `DELETE FROM shared WHERE user_id='${id}';`
          conn.query(sql, (err, results) => {
            if(err) callback(err, null); 
            else callback(null, results);                
          })
        }
      })
    }
  }