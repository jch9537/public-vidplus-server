require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const routes = require("./controllers/routes");

const app = express();
const port = process.env.SRV_PORT;

app.use(cors({
  origin: process.env.CLNT_CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(session({
  secret: process.env.SRV_SESS_SECRET, // session hijacking을 막기위해 hash값에 추가로 들어가는 값 (Salt와 비슷한 개념)
  resave: false, // session을 언제나 저장할지 정하는 값
  saveUninitialized: true // 세션이 저장되기 전에 uninitialized 상태로 만들어 저장
}));

app.use(passport.initialize());
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  console.log('googlestrategy');
  done(null, profile);
}
));
  
app.use(express.json());
app.use("/", routes);

app.listen(port);
console.log(`http://localhost:${port} Listening...`);

module.exports = app;
