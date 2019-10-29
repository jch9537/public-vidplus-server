const conn = require('../database/connection');

module.exports = {
  get: (req, res) => {
    res.status(200).send('Get Note')
  },
  post: (req, res) => {
    res.status(201).send('Post Note')
  },
  put: (req, res) => {
    res.status(201).send('Put Note')
  },
  delete: (req, res) => {
    res.status(201).send('Delete Note')
  }
}