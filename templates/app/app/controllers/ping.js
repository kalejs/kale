'use strict';

var ping = (ctx) => {
  ctx.status = 200;
  ctx.body = 'pong';
};

module.exports = {
  ping
};
