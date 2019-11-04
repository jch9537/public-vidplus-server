const crypto = require("crypto");
const userModel = require("../models/user");

module.exports = {
  // 전체 에러분기 다시 확인: api 문서에 나온대로 에러 객체로 변환해서 보내기
  signup: (req, res) => {
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto
        .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
        .update(data.password)
        .digest("base64"),
      name: data.name
    };
    userModel.signup(args, err => {
      if (err) res.status(500).send(err);
      // JSON 객체 형태로 메시지를 보내지 않고, string을 바로 .send()로 보내면 클라이언트에서
      // "unexpected token" 에러가 난다. 따라서 객체의 message 속성 안에다 string을 보낸다.
      else res.status(201).send({ message: "Sign-up successful." });
    });
  },

  signin: (req, res) => {
    const sess = req.session;
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto
        .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
        .update(data.password)
        .digest("base64")
    };
    userModel.signin(args, (err, results) => {
      if (err) res.status(500).send(err);
      // 번호는 규칙에 맞게 에러 타입에 맞는 메세지 보내기
      // console.log()서버에서 에러메세지
      // res.status.send로 에러보내기
      else {
        console.log("로그인된 유저 정보: ", results[0]);
        sess.userid = results[0].id;
        // Sign-up과 비슷한 이유로 string을 바로 보내지 않고, 객체를 보낸다.
        res.status(200).send({ message: "Sign-in successful." });
      }
    });
  },

  signout: (req, res) => {
    const sess = req.session;
    // req.session.userid = 1
    if (sess.userid) {
      req.session.destroy(err => {
        if (err) res.status(500);
        // Sign-up과 비슷한 이유로 string을 바로 보내지 않고, 객체를 보낸다.
        else res.status(200).send({ message: "Sign-out successful." });
      });
    } else res.status(406);
  },

  get: (req, res) => {
    const sess = req.session;
    // req.session.userid = ;
    const args = sess.userid;
    if (sess.userid) {
      userModel.get(args, (err, results) => {
        // 데이터베이스 끌어오는 에러는 500으로 처리
        if (err) res.status(401).send("Not Logged In.");
        else {
          // console.log('에쎄쓰 :', sess);
          console.log("리절트 :", results);
          const data = {};
          data.email = results[0].email;
          data.name = results[0].name;
          // 유저 정보 (data) 보내주기
          res.status(200).send(data);
        }
      });
    } else res.status(401).send("Not Logged In.");
  },

  // 들어올 정보를 가정하고 Update진행
  // 먼저 정보가 맞는지 확인하고 post -> 변경할 값을 put하나?
  put: (req, res) => {
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto
        .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
        .update(data.password)
        .digest("base64"),
      name: data.name
    };
    console.log("리퀘스트 바디 : ", data);
    const sess = req.session;
    if (sess.userid) {
      userModel.put(args, (err, results) => {
        if (err) res.status(500).send(err);
        // EDIT: 여기도 알맞은 객체 형태로 변환하면 좋다.
        else {
          const { email, name } = results[0];
          res.status(200).send({ email, name });
        }
      });
    }
  },
  delete: (req, res) => {
    const sess = req.session;
    sess.userid = 13;
    if (sess.userid) {
      const args = sess.userid;
      userModel.delete(args, err => {
        if (err) res.status(500).send(err);
        else res.status(200).send({ message: "Deleted user." });
      });
    }
  }
};
