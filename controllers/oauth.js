const conn = require('../database/connection');

module.exports = {
  signinOrSignup: (req, res) => {
    const sql = `SELECT id FROM users WHERE email = '${req.query.email}';`;
    conn.query(sql, (err, results) => {
      if (err) return res.redirect(`${process.env.CLNT_ORIGIN}/`);
      if (!results.length) return console.log(`no record`);

      console.log(results);


    });










  }
}