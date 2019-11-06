const conn = require('../database/connection');

module.exports = {
  signinOrSignup: (req, res) => {
    let sql = `SELECT id FROM users WHERE email = '${req.query.email}';`;
    conn.query(sql, (e1, r1) => {
      if (e1) return res.redirect(`${process.env.CNT_ADDRESS}/`);
      if (!r1.length) {
        sql = `INSERT INTO users (email, password, name) VALUES ('${req.query.email}', '@OAUTH', '${req.query.name}');`;
        conn.query(sql, (e2, r2) => {
          if (e2) return res.redirect(`${process.env.CLNT_ADDRESS}/home`);
          req.session.userid = r2.insertId;
          return res.redirect(`${process.env.CLNT_ADDRESS}/home`);
        });
      } else {
        req.session.userid = r1[0].id;
        return res.redirect(`${process.env.CLNT_ADDRESS}/home`);
      }
      return null;;
    });
  }
}