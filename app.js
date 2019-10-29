const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const routes = require('./controllers/routes');

const app = express();
const port = 8080;

app.use(cors({
  origin:'*',
  methods:['GET','POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(session({
  secret: '@vid+', // session hijacking을 막기위해 hash값에 추가로 들어가는 값 (Salt와 비슷한 개념)
  resave: false, // session을 언제나 저장할지 정하는 값
  saveUninitialized: true // 세션이 저장되기 전에 uninitialized 상태로 만들어 저장
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // 중첩 객체를 허용할지 말지를 결정하는 옵션 https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436
app.set('crypto-secret', 'vid+')

app.use('/', routes);

app.set('port', port)
app.listen(app.get('port'));

module.exports = app;