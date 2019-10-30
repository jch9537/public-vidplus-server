const conn = require('../database/connection');

module.exports = {
  get: (req, res) => {
    res.status(200).send('Get Spaces')
  },
  getOne: (req, res) => {
    res.status(200).send('Get a Space')
  },
  post: (req, res) => {
    res.status(201).send('Post Space')
  },
  put: (req, res) => {
    res.status(201).send('Put Space')
  },
  delete: (req, res) => {
    res.status(201).send('Delete Space')
  }
}