'use strict';

var controllers = require('../app/controllers');
var router = require('koa-router')({
  prefix: '/api/v1'
});

router.get('/ping', controllers.ping.ping);

module.exports = router;
