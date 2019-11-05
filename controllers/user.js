const crypto = require("crypto");
const userModel = require("../models/user");

module.exports = {
  signup: (req, res) => {
    const data = req.body;

    if(!(data.email && data.password && data.name)){
      res.status(400).send({err: {status: 400, message: 'body를 다음과 같이 수정해주세요: {email, password, name}'}});
    } else {
      const args = {
        email: data.email,
        password: crypto
          .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
          .update(data.password)
          .digest("base64"),
        name: data.name
      };
      userModel.signup(args, (err, results) => {
        if(err && err.errno === 1062) return res.status(409).send({err: {status:409, message: '이미 사용중인 email입니다.'}})
        else if(err) return res.status(500).send({err: {status: 500, message: '회원가입실패'}});
        else res.status(201).send({ message: "Sign-up successful." });
      });
    }
  },

  signin: (req, res) => {
    const data = req.body;
    const sess = req.session;

    if(!(data.email && data.password)){
      res.status(400).send({err: {status: 400, message: 'body를 다음과 같이 수정해주세요: {email, password, name}'}});
    } else {
      const args = {
        email: data.email,
        password: crypto
          .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
          .update(data.password)
          .digest("base64")
      };
      userModel.signin(args, (err, results) => {
        if (err) return res.status(500).send({err: {status: 500, message: "Sign in 실패"}});
        else {
          if(results === 'No match Email') return res.status(409).send({err: {status: 409, message: "일치하는 회원 정보가 존재하지 않습니다."}});
          else if(results === 'No match password') return res.status(401).send({err: {status: 401, message: "비밀번호가 일치하지 않습니다."}});
          sess.userid = results[0].id;
          res.status(200).send({ message: "Sign-in successful." });
        }
      });
    } 
  },

  signout: (req, res) => {
    if (!req.session.userid) {
      res.status(406).send({err: {status: 406, message: "Sign in 상태가 아닙니다."}})
    } else {
      req.session.destroy(err => {
        if (err) res.status(500).send({err: {status: 500, message: "Sign out 실패"}})
        else res.status(200).send({ message: "Sign-out successful." });
      });
    }
  },

  get: (req, res) => {
    const args = req.session.userid;

    if (!req.session.userid) {
      res.status(401).send({err: {status: 401, message: "회원정보를 가져오기 위해 sign in이 필요합니다."}})
    } else {
      userModel.get(args, (err, results) => {
        if (err) res.status(500).send({err: {status: 500, message: "회원정보 가져오기 실패"}});
        else {
          res.status(200).send({email: results[0].email, name: results[0].name});
        }
      });
    }
  },

  put: (req, res) => {
    if(!req.session.userid) {
      res.status(401).send({err: {status: 401, message: "회원정보를 가져오기 위해 sign in이 필요합니다."}})
    } 
    else {
      const data = req.body;
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
          if (err) res.status(500).send({err: {status: 500, message: "회원정보 수정 실패"}});
          else {
            if(!results.length) return res.status(409).send({err: {status: 400, message: "다른 유저가 사용 중인 email 입니다."}}); 
            const { email, name } = results[0];
            res.status(200).send({email, name, status: 200, message: '회원정보 수정 완료'});
          }
        });
    }
  },
  delete: (req, res) => {
    const sess = req.session;
 
    if (!sess.userid) {
      res.status(401).send({err:{status:401, message: "Unauthorized - sign in이 필요합니다."}});
    } 
    else {
      const args = sess.userid;
      userModel.delete(args, err => {
        if (err) res.status(500).send({err: {status: 500, message: "회원정보 삭제 실패"}});
        else res.status(200).send({ message: "Deleted user." });
      });
    }
  }
};
