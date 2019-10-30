const spaceModel = require('../models/space');
const noteModel = require('../models/note');

module.exports = {
  get: (req, res) => {
    console.log(`[Ctrl.Space][Request:${req.session.userId}]`);
    // Controller 핸들링
    const args = {
      userId: req.session.userId
    };
    // Model 호출
    spaceModel.get(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(data);
    });
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
    console.log(`[Ctrl.Space][Request:${JSON.stringify(req.body)}]`);
    // Controller 핸들링
    const args = {
      url: req.body.url,
      name: req.body.name,
      userId: req.session.userId
    };
    // Model 호출
    spaceModel.post(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).json({id: data, url: args.url, name: args.name});
    });
  },
  put: (req, res) => {
    res.status(201).send('Put Space');
  },
  delete: (req, res) => {
    res.status(201).send('Delete Space');
  }
}