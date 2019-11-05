const conn = require('../database/connection');

module.exports = {
  signinOrSignup: (req, res) => {
    let sql = `SELECT id FROM users WHERE email = '${req.query.email}';`;
    conn.query(sql, (e1, r1) => {
      if (e1) return res.redirect(`${process.env.CLNT_ORIGIN}/`);
      if (!r1.length) {
        sql = `INSERT INTO users (email, name) VALUES ('${req.query.email}', '${req.query.name}');`;
        conn.query(sql, (e2, r2) => {
          if (e2) return res.redirect(`${process.env.CLNT_ORIGIN}/`);
          req.session.userid = r2.insertId;
          return res.redirect('/spaces');
        });
      } else {
        req.session.userid = r1[0].id;
        return res.redirect('/spaces');
      }
      

    });










  }
}