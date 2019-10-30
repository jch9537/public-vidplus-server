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
    // signout: (args, callback) => {
    //  sessionId로 해서 필요없을 것 같음
    // },
    get: (args, callback) => {

    },
    put: (args, callback) => {

    },
    delete: (args, callback) => {

    }
  }