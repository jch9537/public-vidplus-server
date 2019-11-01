const spaceModel = require('../models/space');

module.exports = {
  get: (req, res) => {
    const args = {
      userId: req.session.userid
    };
    spaceModel.get(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(data);
    });
  },
  getOne: (req, res) => {
    const args = {
      spaceId: req.params.spaceId
    };
    spaceModel.getOne(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(data);
    });
  },
  post: (req, res) => {
    const args = {
      url: req.body.url,
      name: req.body.name,
      userId: req.session.userid
    };
    spaceModel.post(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).json({id: data, url: args.url, name: args.name});
    });
  },
  put: (req, res) => {
    const args = {
      id: req.params.spaceId,
      name: req.body.name
    };
    spaceModel.put(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).json({id: args.id, url: 'TBD', name: args.name});
    });
  },
  delete: (req, res) => {
    const args = { 
      id: req.params.spaceId,
      userId: req.session.userid 
    };
    spaceModel.delete(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).send('Space deleted.');
    });
  }
}