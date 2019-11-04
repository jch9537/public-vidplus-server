const conn = require('../database/connection');

module.exports = {
  signinOrSignup: (profile, callback) => {
    console.log(JSON.stringify(profile));
    callback(null, profile);





    const sql = `SELECT id FROM users WHERE email = '${profile.emails[0].value}';`;
    conn.query(sql, (err, results) => {
      if (err) return callback(err, null);

      console.log(results);
      return null;
      
    });





  }
}