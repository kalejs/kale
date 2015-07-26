'use strict';

var _ = require('lodash');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

module.exports = function(name) {
  var modelGenerator = require('./model');
  var controllerGenerator = require('./controller');

  var underscored = _.str.underscored(name);
  var camelized = _.str.camelize(underscored);
  var controllerName = _.str.inflection.pluralize(camelized);

  modelGenerator(name);
  controllerGenerator(controllerName);

  console.log(`${name} scaffolding generated.`);
};
