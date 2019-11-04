const routes = require('express').Router();
const passport = require('passport');
const authCtrl = require('./oauth');
const userCtrl = require('./user');
const spaceCtrl = require('./space');
const noteCtrl = require('./note');

routes.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
routes.get('/auth/callback', 
  passport.authenticate('google', { session: false }), (req, res) => res.redirect(`${process.env.CLNT_ORIGIN}/auth/sigininOrSignup?email=${process.env.CLNT_ORIGIN}`));
routes.get('/auth/signinOrSignup', authCtrl.signinOrSignout);

routes.post('/user/signup', userCtrl.signup);
routes.post('/user/signin', userCtrl.signin);
routes.post('/user/signout', userCtrl.signout);
routes.get('/user', userCtrl.get);
routes.put('/user', userCtrl.put);
routes.delete('/user', userCtrl.delete);

routes.get('/spaces', spaceCtrl.get);
routes.get('/spaces/:spaceId', spaceCtrl.getOne);
routes.post('/spaces', spaceCtrl.post);
routes.put('/spaces/:spaceId', spaceCtrl.put);
routes.delete('/spaces/:spaceId', spaceCtrl.delete);

routes.get('/notes', noteCtrl.get);
routes.post('/notes', noteCtrl.post);
routes.put('/notes/:noteId', noteCtrl.put);
routes.delete('/notes/:noteId', noteCtrl.delete);

module.exports = routes;