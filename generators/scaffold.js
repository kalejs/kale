'use strict';

module.exports = function(name, options) {
  var modelGenerator = require('./model');
  var controllerGenerator = require('./controller');
  var viewGenerator = require('./view');

  modelGenerator(name, options);
  controllerGenerator(name, options);
  viewGenerator(name, options);

  console.log(`Scaffolding generated.`);
};
