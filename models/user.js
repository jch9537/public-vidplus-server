const conn = require('../database/connection');

module.exports = {
    signup: ({email, password, name}, callback) => { 
      // console.log(`[Model.User][Param:{${email}, ${password}, ${name}}]`);
      let sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?);';
      const arg = [email, password, name];
      // console.log(`[Model.User][SQL:${sql}]`);
      conn.query(sql, arg, (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
      });
    },
    signin: ({email, password}, callback) => {
      let sql = `SELECT * FROM users WHERE email='${email}'`
      conn.query(sql, (err, results) => {
        if(err) callback('No match Email', null)
        else {
          sql = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`
          conn.query(sql, (err, results) => {
            if(err) callback('No match password', null)
            else(callback(null, results))
          })
        }
      })
    },
    get: (id, callback) => {
      let sql = `SELECT * FROM users WHERE id='${id}'`;
      // console.log('에스큐엘 :', sql)
      conn.query(sql, (err, result) => {
        if(err){
          callback(err, null);
        } else callback(null, result);
      });
    },
    put: ({email, password, name, id}, callback) => {
      // console.log('아규먼트 :', email,':', password,':', name, ':',id)
      let sql = `UPDATE users SET email='${email}', password='${password}', name='${name}' WHERE id='${id}';`
      // console.log('에스큐엘 ', sql)
      conn.query(sql, (err, results) => {
        console.log('업데이트 에러', err)
        if(err) callback(err, null);
        else {
          sql = `SELECT * FROM users WHERE id='${id}';`
          conn.query(sql, (err, results) => {
            console.log('셀렉트 에러 : ', err)
            if(err) callback(err, null);
            else callback(null, results);
          })
        }
      })
    },
    delete: (id, callback) => {
      let sql = `DELETE FROM users WHERE id='${id}';`
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