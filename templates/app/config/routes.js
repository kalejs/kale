'use strict';

var controllers = require('../app/controllers');
var router = require('koa-router')();

router.get('/ping', controllers.ping.ping);

module.exports = router;
