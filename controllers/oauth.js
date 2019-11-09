const { google } = require("googleapis");
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
  },

  createGoogleDoc: (req, res) => {
    const redirectUrl = process.env.CLNT_ADDRESS;
    try {
      // 문서를 만들고 싶은 space의 정보를 일단 db에서 가져온다. 아까 세션에 저장한 space_id를 사용한다.
      let sql = `SELECT * FROM spaces WHERE id = ${req.session.space_id}`;
      conn.query(sql, (e1, r1) => {
        // db쪽에 에러가 나면, 500코드로 처리해 보내준다
        if (e1) return res.redirect(500, redirectUrl);
        const { name, url } = r1[0]; // 해당 스페이스의 이름, url
        // 그 이후로 해당 스페이스의 모든 노트를 db에서 가져온다.
        sql = `SELECT * FROM notes WHERE space_id = ${req.session.space_id}`;

        conn.query(sql, async (e2, r2) => {
          if (e2) return res.redirect(500, redirectUrl); // 다시 한번 500으로 에러 처리
          r2.sort(
            (a, b) =>
              a.timestamp.replace(/:/g, "") - b.timestamp.replace(/:/g, "")
          ); // 시간순으로 모든 노트를 정렬한다.

          // Google Docs와 연결하는 절차
          const oauth2Client = req.app.get("docsClient");
          // 콜백url의 query string에 ?code={authCode} 이렇게 넘어오는데, 이 코드를 사용해
          // google doc만들기에 사용될 토큰을 발급받는다.
          const { code } = req.query;
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          // 토큰으로 credentials를 세팅한 후, 해당 유저의 google docs로 접속
          const docs = google.docs({
            version: "v1",
            auth: oauth2Client
          });
          // Google doc생성
          const createResponse = await docs.documents.create({
            requestBody: {
              title: `${name} - Vidplus Notes`
            }
          });
          const { documentId } = createResponse.data;

          // 방금 생성 Google doc에다 노트를 추가
          await docs.documents.batchUpdate({
            documentId,
            requestBody: {
              requests: [
                {
                  // 첫번쨰 줄 (영상 url 정보)
                  insertText: {
                    text: `The video can be found at: ${url}\n\n`,
                    endOfSegmentLocation: {
                      segmentId: ""
                    }
                  }
                },
                // 각자 노트마다 새롭게 문서에 text를 추가하기
                ...r2.map(note => ({
                  insertText: {
                    text: `■ ${note.timestamp} - ${note.content}\n\n`,
                    endOfSegmentLocation: {
                      segmentId: ""
                    }
                  }
                }))
              ]
            }
          });
          return res.redirect(`${redirectUrl}/spaces/${name}`);
        });
      });
    } catch (error) {
      // 만약 실행된 프로미스 중에 에러가 난다면, 바로 500 response로 리디렉트
      return res.redirect(500, redirectUrl);
    }
  }
};
