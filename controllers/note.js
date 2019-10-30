const noteModel = require('../models/note');

module.exports = {
  get: (req, res) => {
    console.log(`[Ctrl.Note][Request:${JSON.stringify(req.query.space_id)}]`);
    // Controller 핸들링
    const args = {
      spaceId: req.query.space_id
    };
    // Model 호출
    noteModel.get(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(data);
    });
  },
  post: (req, res) => {
    console.log(`[Ctrl.Note][Request:${JSON.stringify(req.body)}]`);
    // Controller 핸들링
    const args = {
      spaceId: req.body.space_id,
      timestamp:req.body.timestamp,
      content: req.body.content
    };
    // Model 호출
    noteModel.post(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).json({id: data.insertId, space_id: args.spaceId, timestamp: args.timestamp, content: args.content});
    });
  },
  put: (req, res) => {
    res.status(201).send('Put a Note');
  },
  delete: (req, res) => {
    res.status(201).send('Delete a Note');
  }
}