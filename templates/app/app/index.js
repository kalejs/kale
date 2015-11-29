'use strict';

const body = require('koa-json-body');
const config = require('../config');
const convert = require('koa-convert');
const cors = require('kcors');
const helmet = require('koa-helmet');
const json = require('koa-json');
const Koa = require('koa');
const logger = require('koa-morgan').middleware;
const middleware = require('./middleware');
const path = require('path');
const router = require('./routes');
const send = require('koa-send');
const serve = require('koa-static');

const app = new Koa();

app.use(logger(config.logging.format));
app.use(helmet());
app.use(convert(cors()));
app.use(body());
app.use(convert(json(config.json)));

app.use(middleware.config);
app.use(middleware.models);
app.use(middleware.errors);

app.use(router);

app.use((ctx, next) => {
  if (!ctx.path.startsWith('/api/')) {
    return next();
  }
});
app.use(convert(serve(path.join(__dirname, '..', 'public'))));
app.use((ctx) => {
  return send(ctx, 'layout.html', {
    root: path.join(__dirname, '..', 'public', 'assets', 'views')
  });
});

module.exports = app;
