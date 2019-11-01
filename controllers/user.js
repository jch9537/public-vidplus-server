const crypto = require('crypto');
const userModel = require('../models/user');

module.exports = {
  // 전체 에러분기 다시 확인!! 객체로 
  signup: (req, res) => {
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto.createHmac('sha512', process.env.SRV_CRYPTO_SALT)
                      .update(data.password)
                      .digest('base64'),
      name: data.name
    };
    userModel.signup(args, (err, results) => {
      if (err) res.status(500).send(err)
      else res.status(201).json(results.insertId)
    });
  },

  signin: (req, res) => {
    let sess = req.session;
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto.createHmac('sha512', process.env.SRV_CRYPTO_SALT) 
                      .update(data.password)
                      .digest('base64')
    }
    userModel.signin(args, (err, results) => {
      if(err) res.status(500).send(err);
        // 번호는 규칙에 맞게 에러 타입에 맞는 메세지 보내기
        // console.log()서버에서 에러메세지
        // res.status.send로 에러보내기
      else {
        console.log('데이터 : ', results)
        sess.userid = results[0].id;
        res.status(200).send('Log in.')
      }
    });
  },

  signout: (req, res) => {
    const sess  = req.session;
    // req.session.userid = 1
    if(sess.userid) {
      req.session.destroy(err => {
        if(err) res.status(500)
        else res.redirect(200, '/');
      })
    } else res.redirect(200,'/');
  },

  get: (req, res) => {
    const sess = req.session;
    // req.session.userid = ;
    let args = sess.userid;
    if(sess.userid){
      userModel.get(args, (err, results) => {
        if(err) res.status(401).send('Not Logged In.');
        else {
          // console.log('에쎄쓰 :', sess);
          console.log('리절트 :', results)
          let data = {};
          data.email = results[0].email;
          data.name = results[0].name
          res.status(200).send(results);
        }
      });
    } 
    else res.status(401).send('Not Logged In.');
  },

  // 들어올 정보를 가정하고 Update진행
  // 먼저 정보가 맞는지 확인하고 post -> 변경할 값을 put하나?
  put: (req, res) => {
    const data = req.body;
    const args = {
      email: data.email,
      password: crypto.createHmac('sha512', process.env.SRV_CRYPTO_SALT) 
                      .update(data.password)
                      .digest('base64'),
      name: data.name
    };
    console.log('리퀘스트 바디 : ', data)
    const sess = req.session;
    if(sess.userid){
      userModel.put(args, (err, results) => {
        if(err)res.status(500).send(err); 
        else res.status(201).send('Complete Changes');
      })
    }

  },
  delete: (req, res) => {
    const sess = req.session;
    sess.userid = 13;
    if(sess.userid) {
      let args = sess.userid;
      userModel.delete(args, (err, results) => {
        if(err)res.status(500).send(err) ; 
        else res.status(200).send('Delete User')
      })
    }
  }
}