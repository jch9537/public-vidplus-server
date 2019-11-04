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

/*
  GOOGLE_CLIENT_ID=800354062285-l54a81s5v44qkkuqmevsvo39l41mas4a.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=HHUkkkk8K3jwGfwAHNC3Z82Z
  GOOGLE_CALLBACK_URL=http://metawig.com:8080/auth/callback
*/