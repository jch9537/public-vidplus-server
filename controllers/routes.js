require("dotenv").config();
const routes = require("express").Router();
const passport = require("passport");
const authCtrl = require("./oauth");
const userCtrl = require("./user");
const spaceCtrl = require("./space");
const noteCtrl = require("./note");

// 클라이언트가 /auth/google로 가면, 서버가 구글 인증 창을 띄워서 로그인해주게 한다.
// scope는 구글에서 돌아오는 사용자 정보의 범위를 설정해준다.
routes.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"]
  })
);

// 인증 후, 구글이 클라이언트를 {server}/auth/callback으로 리디렉트 해주는데, 이때
// GoogleStrategy의 콜백이 실행되면서 프로필의 이메일과 이름을 'email', 'name'에 할당한다.
// 이 정보를 통해 유저를 또 다른 엔드포인트로 보내준다. 다음은 oauth.js를 살펴보도록 한다.
routes.get(
  "/auth/callback",
  passport.authenticate("google", { session: false }),
  (req, res) =>
    res.redirect(
      `/auth/signinOrSignup?email=${req.app.get("email")}&name=${req.app.get(
        "name"
      )}`
    )
);
routes.get("/auth/signinOrSignup", authCtrl.signinOrSignup);

// *GOOGLE DOCS으로 노트 문서 만들기
// 클라이언트가 /auth/docs를 열기 전에, 일단 이쪽으로 POST 리퀘스트를
// 날려서 현재 space_id를 자신의 해당 세션에 저장한다.
routes.post("/auth/docs", (req, res) => {
  if (!req.session.userid) {
    // 해당 경우에는 클라이언트(vidplus)가 POST리퀘스트가 실패했다는 것을
    // 감지하고, 따로 /auth/docs로 유저를 리디렉트 하지 않는다.
    res.status(401).send({
      error: {
        status: 401,
        message: "본인 인증을 한 후 Google Doc을 만들 수 있습니다."
      }
    });
  } else {
    req.session.space_id = req.body.id;
    res.status(201).send({
      message: "Google Doc을 만들기 위한 workspace를 저장하였습니다."
    });
  }
});

// POST request를 보낸 후, 유저는 이 url로 리디렉트 되어서 OAuth동의 페이지를 보게 된다.
routes.get("/auth/docs", (req, res) => {
  // OAuth2 클라이언트를 만들어서, 다른 사람들이 우리 서버 로직을 통해
  // google docs를 만들 수 있게 해준다.
  const oauth2Client = req.app.get("docsClient");
  // 사용자의 google docs 편집 동의 페이지 url을 만드는 작업이다.
  const url = oauth2Client.generateAuthUrl({
    scope: ["https://www.googleapis.com/auth/documents"]
  });
  res.redirect(url); // 브라우저에서 동의 페이지 열기
});

// Google Docs 동의 페이지에서 여기로 리디렉트되면, oauth.js에 있는 createGoogleDoc함수를 실행한다.
routes.get("/auth/docs_callback", authCtrl.createGoogleDoc);

routes.post("/user/signup", userCtrl.signup);
routes.post("/user/signin", userCtrl.signin);
routes.post("/user/signout", userCtrl.signout);
routes.post("/user/passwordSend", userCtrl.sendPassword);
routes.get("/user", userCtrl.get);
routes.put("/user", userCtrl.put);
routes.delete("/user", userCtrl.delete);

routes.get("/spaces", spaceCtrl.get);
routes.get("/spaces/:spaceId", spaceCtrl.getOne);
routes.post("/spaces", spaceCtrl.post);
routes.put("/spaces/:spaceId", spaceCtrl.put);
routes.delete("/spaces/:spaceId", spaceCtrl.delete);

routes.get("/notes", noteCtrl.get);
routes.post("/notes", noteCtrl.post);
routes.put("/notes/:noteId", noteCtrl.put);
routes.delete("/notes/:noteId", noteCtrl.delete);

module.exports = routes;
