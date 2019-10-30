const crypto = require('crypto');
const userModel = require('../models/user');

module.exports = {
  signup: (req, res) => {
    console.log(`[Ctrl.User][Request:${JSON.stringify(req.body)}]`);
    // Controller 핸들링
    const args = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    };
    // Model 호출
    userModel.signup(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).json(data.insertId);
    });
  },
  signin: (req, res) => {
    res.status(200).send('Sign In');
  },
  signout: (req, res) => {
    res.status(200).send('Sign Out');
  },
  get: (req, res) => {
    res.status(200).send('Get User');
  },
  put: (req, res) => {
    res.status(201).send('Put User');
  },
  delete: (req, res) => {
    res.status(201).send('Delete User');
  }
}