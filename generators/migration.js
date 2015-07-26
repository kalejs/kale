'use strict';

var execSync = require('child_process').execSync;
var path = require('path');

module.exports = function(name) {
  var knex = path.join('.', 'node_modules', '.bin', 'knex');
  var result = execSync(`${knex} migrate:make ${name}`, { encoding: 'utf8' });
  console.log(result);
};

