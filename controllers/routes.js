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
