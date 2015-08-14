'use strict';

var app = require('koa')();
var body = require('koa-json-body');
var config = require('../config');
var cors = require('kcors');
var helmet = require('koa-helmet');
var json = require('koa-json');
var logger = require('koa-morgan').middleware;
var middleware = require('./middleware');
var path = require('path');
var router = require('../config/routes');
var send = require('koa-send');

app.use(logger(config.logging.format));
app.use(helmet());
app.use(cors());
app.use(body());
app.use(json(config.json));
app.use(middleware.config);

app.use(middleware.assets);
app.use(middleware.models);
app.use(router.routes());
app.use(router.allowedMethods());

app.use(function *(){
  yield send(this, 'layout.html', { root: path.join(this.config.root, 'app', 'assets', 'views') });
});

module.exports = app;
