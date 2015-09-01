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
var serve = require('koa-static');

app.use(logger(config.logging.format));
app.use(helmet());
app.use(cors());
app.use(body());
app.use(json(config.json));
app.use(middleware.config);
app.use(middleware.models);

app.use(middleware.errors);
app.use(router.routes());
app.use(router.allowedMethods());

app.use(serve(path.join(__dirname, '..', 'public')));
app.use(function *(){
  yield send(this, 'layout.html', {
    root: path.join(__dirname, '..', 'public', 'assets', 'views')
  });
});

module.exports = app;
