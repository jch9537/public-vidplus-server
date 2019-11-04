const conn = require('../database/connection');

module.exports = {
  signinOrSignup: (profile, callback) => {
    console.log(JSON.stringify(profile));
    callback(null, null);
  }
}