const noteModel = require("../models/note");

module.exports = {
  get: (req, res) => {
    if (!req.session.userid)
      return res.status(401).send({
        error: {
          status: 401,
          message: "본인 인증을 한 후 노트를 가져올 수 있습니다."
        }
      });
    if (!req.query.space_id)
      return res.status(400).send({
        error: {
          status: 400,
          message: "url을 다음과 같이 수정해주세요: notes?space_id={space_id}"
        }
      });
    const args = {
      spaceId: Number(req.query.space_id),
      userId: req.session.userid
    };
    noteModel.get(args, (err, data) => {
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "노트 불러오기 실패" } });
      return res.status(200).json(data);
    });
    return null;
  },
  post: (req, res) => {
    if (!req.session.userid)
      return res.status(401).send({
        error: {
          status: 401,
          message: "본인 인증을 한 후 노트를 생성할 수 있습니다."
        }
      });
    if (
      !req.body.space_id ||
      !req.body.timestamp ||
      (!req.body.content && req.body.content !== "")
    )
      return res.status(400).send({
        error: {
          status: 400,
          message:
            "body를 다음과 같이 수정해주세요: {space_id, timestamp, content}"
        }
      });
    const args = {
      spaceId: req.body.space_id,
      timestamp: req.body.timestamp,
      content: req.body.content
    };
    noteModel.post(args, (err, data) => {
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "노트 생성 실패" } });
      return res.status(201).json({
        id: data.insertId,
        space_id: args.spaceId,
        timestamp: args.timestamp,
        content: args.content
      });
    });
    return null;
  },
  put: (req, res) => {
    if (!req.session.userid)
      return res.status(401).send({
        error: {
          status: 401,
          message: "본인 인증을 한 후 노트를 수정할 수 있습니다."
        }
      });
    if (!req.body.timestamp || (!req.body.content && req.body.content !== ""))
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요: {timestamp, content}"
        }
      });
    const args = {
      userId: req.session.userid,
      id: Number(req.params.noteId),
      spaceId: req.body.space_id,
      timestamp: req.body.timestamp,
      content: req.body.content
    };
    noteModel.put(args, err => {
      if (err === 0)
        return res.status(401).send({
          error: {
            status: 404,
            message: "해당 id를 가진 노트를 찾을 수가 없습니다."
          }
        });
      if (err ===1)
        return res.status(401).send({
          error: {
            status: 401,
            message: "사용자는 해당 노트에 대한 수정 권한이 없습니다."
          }
        });
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "노트 수정 실패" } });
      return res.status(200).json({
        id: args.id,
        space_id: args.spaceId,
        timestamp: args.timestamp,
        content: args.content
      });
    });
    return null;
  },
  delete: (req, res) => {
    if (!req.session.userid)
      return res.status(401).send({
        error: {
          status: 401,
          message: "본인 인증을 한 후 노트를 삭제할 수 있습니다."
        }
      });
    const args = {
      id: Number(req.params.noteId),
      userId: req.session.userid
    };
    noteModel.delete(args, (err, data) => {
      if (err === 0)
        return res.status(404).send({
          error: {
            status: 404,
            message: "해당 id를 가진 노트를 찾을 수가 없습니다."
          }
        });
      if (err === 1) 
        return res.status(401).send({
          error: {
            status: 401,
            message: "사용자는 해당 노트에 대한 삭제 권한이 없습니다."
          }
        });
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "노트 삭제 실패" } });
      if (!data.affectedRows)
        return res.status(404).send({
          error: {
            status: 404,
            message: "해당 id를 가진 노트를 찾을 수가 없습니다."
          }
        });
      return res.status(200).send({ id: args.id, deleted: true });
    });
    return null;
  }
};
