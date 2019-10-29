const conn = require('../database/connection');

module.exports = {
  signup: (req, res) => {
    const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?);';
    const arg = [req.body.email, req.body.password, req.body.name];
    conn.query(sql, arg, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(201).send(results);
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