const conn = require("../database/connection");

module.exports = {
  signinOrSignup: (req, res) => {
    // queryString으로 넘어온 구글 유저 정보를 사용해 db에 저장되어있는지 확인한다.
    let sql = `SELECT id FROM users WHERE email = '${req.query.email}';`;
    conn.query(sql, (e1, r1) => {
      if (e1) return res.redirect(`${process.env.CNT_ADDRESS}/`); // 에러 처리
      if (!r1.length) {
        // 만약 구글 유저가 아직까지 db에 등록되어있지 않으면, db에 등록을 해준다
        sql = `INSERT INTO users (email, password, name, oauth_signup) VALUES ('${req.query.email}', '@OAUTH', '${req.query.name}', true);`;
        conn.query(sql, (e2, r2) => {
          // 에러가 난다면, sessionId를 부여하지 않는다. 따라서 로그인 페이지로 다시 가게된다
          if (e2) return res.redirect(`${process.env.CLNT_ADDRESS}/home`);
          // 정상적으로 만들어졌으면 유저 세션을 새로 생성한 후 Workspaces 목록으로 보내준다
          req.session.userid = r2.insertId;
          return res.redirect(`${process.env.CLNT_ADDRESS}/home`);
        });
      } else {
        // 벌써 존재하는 유저라면, 바로 홈페이지(workspace 목록)으로 보내준다
        req.session.userid = r1[0].id;
        return res.redirect(`${process.env.CLNT_ADDRESS}/home`);
      }
      return null;
    });
  }
};
