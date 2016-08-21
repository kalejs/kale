'use strict';

const Kale = require('kalejs');
const path = require('path');
const send = require('koa-send');

const app = new Kale.App();

app.use((ctx) => {
  return send(ctx, 'layout.html', {
    root: path.join(__dirname, '..', 'public', 'assets', 'views')
  });
});

module.exports = app;
