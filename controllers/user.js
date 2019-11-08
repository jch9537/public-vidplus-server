const crypto = require("crypto");
const userModel = require("../models/user");
const nodemailer = require("./nodemailer");

module.exports = {
  signup: (req, res) => {
    const data = req.body;
    if (!(data.email && data.password && data.name)) {
      res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요: {email, password, name}"
        }
      });
    } else {
      const args = {
        email: data.email,
        password: crypto
          .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
          .update(data.password)
          .digest("base64"),
        name: data.name,
        oauth_signup: false
      };
      userModel.signup(args, err => {
        if (err && err.errno === 1062)
          return res.status(409).send({
            error: { status: 409, message: "이미 사용중인 email입니다." }
          });
        if (err)
          return res
            .status(500)
            .send({ error: { status: 500, message: "회원가입실패" } });
        res.status(201).send({ message: "Sign-up successful." });
      });
    }
  },

  signin: (req, res) => {
    const data = req.body;
    const sess = req.session;
    if (!(data.email && data.password)) {
      res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요: {email, password, name}"
        }
      });
    } else {
      const args = {
        email: data.email,
        password: crypto
          .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
          .update(data.password)
          .digest("base64")
      };
      userModel.signin(args, (err, results) => {
        if (err)
          return res
            .status(500)
            .send({ error: { status: 500, message: "Sign in 실패" } });

        if (results === "No match Email")
          return res.status(409).send({
            error: {
              status: 409,
              message: "일치하는 회원 정보가 존재하지 않습니다."
            }
          });
        if (results === "No match password")
          return res.status(401).send({
            error: { status: 401, message: "비밀번호가 일치하지 않습니다." }
          });
        sess.userid = results[0].id;
        res.status(200).send({ message: "Sign-in successful." });
      });
    }
  },

  signout: (req, res) => {
    if (!req.session.userid) {
      res
        .status(406)
        .send({ error: { status: 406, message: "Sign in 상태가 아닙니다." } });
    } else {
      req.session.destroy(err => {
        if (err)
          res
            .status(500)
            .send({ error: { status: 500, message: "Sign out 실패" } });
        else res.status(200).send({ message: "Sign-out successful." });
      });
    }
  },

  sendPassword: (req, res) => {
    const data = req.body;
    if (!(data.email && data.name))
      res.status(400).send({
        error: {
          status: 400,
          message: "email과 name을 같이 작성해주세요."
        }
      });
    else {
      const args = {
        email: data.email,
        name: data.name
      };
      userModel.sendPassword(args, (err, results) => {
        if (err)
          return res
            .status(500)
            .send({ error: { status: 500, message: "임시번호 발송 실패" } });

        if (results === "No match Email")
          return res.status(406).send({
            error: { status: 406, message: "일치하는 회원정보가 없습니다." }
          });
        if (results === "No match Name")
          return res.status(406).send({
            error: { status: 406, message: "이름이 일치하지 않습니다." }
          });
        if (results[0].oauth_signup)
          return res.status(303).send({
            message:
              "이 계정은 구글계정으로 가입되었습니다. 구글메일 인증을 사용해주세요."
          });

        const tempPassword = nodemailer.makeRandomStr(); // 임시 비번 생성
        const param = { email: data.email, password: tempPassword };
        nodemailer.sendEmail(param); // 임시 비번 메일 발송
        // 여기서는 새로 생긴 비밀번호를 해시해서 db에 업데이트 시킴
        const args2 = {
          email: data.email,
          password: crypto
            .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
            .update(tempPassword) // 임시 비밀번호 해싱
            .digest("base64"),
          name: data.name,
          id: results[0].id
        };
        // DB에서 해당 유저정보의 password 변경
        userModel.put(args2, (err2, results2) => {
          if (err2)
            res.status(500).send({
              error: { status: 500, message: "회원정보 수정 실패" }
            });
          else {
            if (!results2.length)
              return res.status(409).send({
                error: {
                  status: 400,
                  message: "다른 유저가 사용 중인 email 입니다."
                }
              });
            res.status(201).send({ message: "임시번호 발송 완료" });
          }
        });
      });
    }
  },

  get: (req, res) => {
    const args = req.session.userid;
    if (!req.session.userid) {
      res.status(401).send({
        error: {
          status: 401,
          message: "회원정보를 가져오기 위해 sign in이 필요합니다."
        }
      });
    } else {
      userModel.get(args, (err, results) => {
        if (err)
          res.status(500).send({
            error: { status: 500, message: "회원정보 가져오기 실패" }
          });
        else {
          console.log("겟 리절트", results);
          res.status(200).send({
            email: results[0].email,
            name: results[0].name,
            oauth_signup: results[0].oauth_signup
          });
        }
      });
    }
  },

  put: (req, res) => {
    // req.session.userid = 8;                     // 테스트
    // req.session.oauth_signup = true;            // OAuth 테스트
    const data = req.body;
    if (!req.session.userid) {
      res.status(401).send({
        error: {
          status: 401,
          message: "회원정보를 가져오기 위해 sign in이 필요합니다."
        }
      });
    } else {
      const args = {
        email: data.email,
        password: crypto
          .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
          .update(data.password)
          .digest("base64"),
        name: data.name,
        id: req.session.userid
      };
      userModel.put(args, (err, results) => {
        if (err)
          res
            .status(500)
            .send({ error: { status: 500, message: "회원정보 수정 실패" } });
        else {
          if (!results.length)
            return res.status(409).send({
              error: {
                status: 409,
                message: "다른 유저가 사용 중인 email 입니다."
              }
            });

          const { email, name } = results[0];
          res.status(200).send({
            email,
            name,
            status: 200,
            message: "회원정보 수정 완료"
          });
        }
      });
    }
  },

  delete: (req, res) => {
    const sess = req.session;
    if (!sess.userid) {
      res.status(401).send({
        error: {
          status: 401,
          message: "Unauthorized - sign in이 필요합니다."
        }
      });
    } else {
      const args = sess.userid;
      userModel.delete(args, err => {
        if (err)
          res
            .status(500)
            .send({ error: { status: 500, message: "회원정보 삭제 실패" } });
        else res.status(200).send({ message: "Deleted user." });
      });
    }
  }
};
