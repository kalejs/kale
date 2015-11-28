'use strict';

var controllers = require('./controllers');
var router = require('koa-simple-router');

module.exports = router({ prefix: '/api/v1' }, (route) => {
  route.get('/ping', controllers.ping.ping);

  route.all('*', (ctx) => {
    ctx.status = 404;
    ctx.body = { error: 'Not Found' };
  });
});
