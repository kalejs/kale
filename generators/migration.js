'use strict';

const Migrate = require('../lib/cli/migrate');
const path = require('path');
const config = require(path.join(process.cwd(), 'config'));

module.exports = function(name) {
  let migrator = new Migrate(config.db, process.cwd());
  return migrator.run('new', name);
};
