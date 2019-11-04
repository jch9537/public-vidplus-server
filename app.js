require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const routes = require("./controllers/routes");

const app = express();
const port = process.env.SRV_PORT;

app.use(
  cors({
    origin: process.env.CLNT_CORS_ORIGIN,
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


const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile); // done() 실행하여야 정상종료
  }
));

passport.serializeUser(function(profile, done) {
  console.log(JSON.stringify(profile));
  done(null, profile);
});
  
passport.deserializeUser(function(profile, done) {
    console.log(profile+'???');
  done(null, profile);
});


app.use(express.json());
app.use("/", routes);

app.set("port", port);
app.listen(app.get("port"));
console.log(`http://localhost:${port} Listening...`);

module.exports = app;
