'use strict';

var config = require('../../config');

module.exports = (ctx, next) => {
  ctx.config = config;
  return next();
};
