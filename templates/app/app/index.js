'use strict';

var app = require('koa')();
var body = require('koa-json-body');
var config = require('../config');
var cors = require('kcors');
var helmet = require('koa-helmet');
var json = require('koa-json');
var logger = require('koa-morgan').middleware;
var middleware = require('./middleware');
var router = require('../config/routes');

app.use(logger(config.logging.format));
app.use(helmet());
app.use(cors());
app.use(body());
app.use(json(config.json));
app.use(middleware.config);
app.use(middleware.models);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
