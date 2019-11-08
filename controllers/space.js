const spaceModel = require("../models/space");

module.exports = {
  get: (req, res) => {
    if (!req.session.userid)
      return res
        .status(401)
        .send({
          error: {
            status: 401,
            message: "본인 인증을 한 후 스페이스 목록을 가져올 수 있습니다."
          }
        });
    const args = {
      userId: req.session.userid
    };
    spaceModel.get(args, (err, data) => {
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "스페이스 불러오기 실패" } });
      return res.status(200).json(data);
    });
    return null;
  },
  getOne: (req, res) => {
    if (!req.session.userid)
      return res
        .status(401)
        .send({
          error: {
            status: 401,
            message: "본인 인증을 한 후 스페이스 목록을 가져올 수 있습니다."
          }
        });
    const args = {
      spaceId: Number(req.params.spaceId),
      userId: req.session.userid
    };
    spaceModel.getOne(args, (err, data) => {
      if (err) return res.status(500).send("스페이스 불러오기 실패");
      if (!data.length)
        return res
          .status(401)
          .send({
            error: {
              status: 401,
              message:
                "사용자는 해당 스페이스를 불러올 수 있는 권한이 없습니다."
            }
          });
      return res.status(200).json(data[0]);
    });
    return null;
  },
  post: (req, res) => {
    if (!req.session.userid)
      return res
        .status(401)
        .send({
          error: {
            status: 401,
            message: "본인 인증을 한 후 스페이스를 생성할 수 있습니다."
          }
        });
    if (!req.body.url || !req.body.name)
      return res
        .status(400)
        .send({
          error: {
            status: 400,
            message: "body를 다음과 같이 수정해주세요: {url, name}"
          }
        });
    const args = {
      url: req.body.url,
      name: req.body.name,
      userId: req.session.userid
    };
    spaceModel.post(args, (err, data) => {
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "스페이스 생성 실패" } });
      return res.status(201).json({ id: data, url: args.url, name: args.name });
    });
    return null;
  },
  put: (req, res) => {
    if (!req.session.userid)
      return res
        .status(401)
        .send({
          error: {
            status: 401,
            message: "본인 인증을 한 후 스페이스 목록을 수정할 수 있습니다."
          }
        });
    if (!req.body.name)
      return res
        .status(400)
        .send({
          error: {
            status: 400,
            message: "body를 다음과 같이 수정해주세요: {name}"
          }
        });
    const args = {
      id: Number(req.params.spaceId),
      name: req.body.name,
      userId: req.session.userid
    };
    spaceModel.put(args, (err, data) => {
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "스페이스 수정 실패" } });
      if (!data.affectedRows)
        return res
          .status(401)
          .send({
            error: {
              status: 401,
              message: "사용자는 해당 스페이스에 대한 수정 권한이 없습니다."
            }
          });
      return res.status(200).json({ id: args.id, url: req.body.url, name: args.name });
    });
    return null;
  },
  delete: (req, res) => {
    if (!req.session.userid)
      return res
        .status(401)
        .send({
          error: {
            status: 401,
            message: "본인 인증을 한 후 스페이스를 삭제할 수 있습니다."
          }
        });
    const args = {
      id: Number(req.params.spaceId),
      userId: req.session.userid
    };
    spaceModel.delete(args, (err, data) => {
      if (err)
        return res
          .status(500)
          .send({ error: { status: 500, message: "스페이스 삭제 실패" } });
      if (!data.affectedRows)
        return res
          .status(401)
          .send({
            error: {
              status: 401,
              message: "사용자는 해당 스페이스에 대한 삭제 권한이 없습니다."
            }
          });
      return res.status(200).send({ id: args.id, deleted: true });
    });
    return null;
  }
};
