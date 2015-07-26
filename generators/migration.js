'use strict';

var exec = require('child_process').exec;
var path = require('path');

module.exports = function(name) {
  var knex = path.join('.', 'node_modules', '.bin', 'knex');

  exec(`${knex} migrate:make ${name}`, function(err, stdout) {
    console.log(err || stdout);
  });
};

