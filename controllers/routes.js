const routes = require('express').Router();
const userCtrl = require('./user');
const spaceCtrl = require('./space');
const noteCtrl = require('./note');

routes.post('/user/signup', userCtrl.signup);
routes.post('/user/signin', userCtrl.signin);
routes.post('/user/signout', userCtrl.signout);
routes.get('/user', userCtrl.get);
routes.put('/user', userCtrl.put);
routes.delete('/user', userCtrl.delete);

routes.get('/spaces', spaceCtrl.get);
routes.get('/spaces/:space_id', spaceCtrl.getOne);
routes.post('/spaces', spaceCtrl.post);
routes.put('/spaces/:space_id', spaceCtrl.put);
routes.delete('/spaces/:space_id', spaceCtrl.delete);

routes.get('/notes', noteCtrl.get);
routes.post('/notes', noteCtrl.post);
routes.put('/notes/:note_id', noteCtrl.put);
routes.delete('/notes/:note_id', noteCtrl.delete);

module.exports = routes;