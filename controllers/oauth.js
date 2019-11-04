const conn = require('../database/connection');

module.exports = {
  signinOrSignup: (profile, session, callback) => {

    const sql = `SELECT id FROM users WHERE email = '${profile.emails[0].value}';`;
    conn.query(sql, (err, results) => {
      if (err) return callback(err, null);


      session.userid = results[0].id;



      callback(null, results[0].id);
      
    });





  }
}