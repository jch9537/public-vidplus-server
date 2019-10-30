const crypto = require('crypto');
const userModel = require('../models/user');

module.exports = {
  signup: (req, res) => {
    const data = req.body
    // console.log(`[Ctrl.User][Request:${JSON.stringify(req.body)}]`);
    // Controller 핸들링
    const args = {
      email: data.email,
      password: crypto.createHmac('sha512', process.env.SRV_CRYPTO_SALT) //salt부분 맞는지 확인
                      .update(data.password)
                      .digest('base64'),
      name: data.name
    };
    // Model 호출
    userModel.signup(args, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).json(data.insertId);
    });
  },
  signin: (req, res) => {
    let sess = req.session;
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto.createHmac('sha512', process.env.SRV_CRYPTO_SALT) 
                      .update(data.password)
                      .digest('base64'),
    }
    userModel.signin(args, (err, data) => {
      if(err) {
        res.status(500).send(err);
        // 번호는 규칙에 맞게 에러 타입에 맞는 메세지 보내기
        // console.log()서버에서 에러메세지
        // res.status.send로 에러보내기
      } else {
        console.log('데이터 : ', data)
        sess.userid = data[0].id;
        res.status(200).send('Log in.')
      }
    });
  },
  signout: (req, res) => {
    const sess  = req.session;
    if(sess.userid) {
      req.session.destroy(err => {
        if(err) {
          res.status(500)
        } else {
          res.redirect(200, '/');
        }
      })
    } else {
      res.redirect(200, '/');
    }
  },
  get: (req, res) => {
    res.status(200).send('Get User');
  },
  put: (req, res) => {
    res.status(201).send('Put User');
  },
  delete: (req, res) => {
    res.status(201).send('Delete User');
  }
}