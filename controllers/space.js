const spaceModel = require('../models/space');
const noteModel = require('../models/note');

module.exports = {
  get: (req, res) => {
    res.status(200).send('Get Spaces');
  },
  getOne: (req, res) => {
    console.log(`[Ctrl.Space][Request:${JSON.stringify(req.params)}]`);
    // Controller 핸들링
    const args = {
      spaceId: req.params.spaceId
    };
    // Model 호출
    spaceModel.getOne(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(data);
    });
  },
  post: (req, res) => {
    res.status(201).send('Post Space');
  },
  put: (req, res) => {
    res.status(201).send('Put Space');
  },
  delete: (req, res) => {
    res.status(201).send('Delete Space');
  }
}