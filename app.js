require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const routes = require("./controllers/routes");

const app = express();
const port = process.env.SRV_PORT;

app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLNT_ADDRESS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(
  session({
    secret: process.env.SRV_SESS_SECRET, // session hijacking을 막기위해 hash값에 추가로 들어가는 값 (Salt와 비슷한 개념)
    resave: false, // session을 언제나 저장할지 정하는 값
    saveUninitialized: true // 세션이 저장되기 전에 uninitialized 상태로 만들어 저장
  })
);

app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      // Google Developer Console에서 만든 api 정보
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google에서 인증됐을때, 콜백을 받는 URL (/auth/google)
      // (Developer Console에 "승인된 리디렉션 URI"에서 설정함)
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      // /auth/callback으로 리디렉션이 된후, 미들웨어로 실행되는 콜백이다.
      // 변수 email, name에다가 프로필로 돌아오는 이메일/이름을 할당한다.
      // 다음은 routes.js를 살펴보면 된다.
      app.set("email", profile.emails[0].value);
      app.set("name", profile.displayName);
      done(null, profile);
    }
  )
);

app.use(express.json());
app.use("/", routes);

app.listen(port);
console.log(`http://localhost:${port} Listening...`);

module.exports = app;
