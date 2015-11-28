'use strict';

var models = require('../models');

module.exports = (ctx, next) => {
  ctx.models = models;
  return next();
};
