'use strict';

const path = require('path');
const Migrate = require('../lib/cli/migrate');

module.exports = function(name) {
  let config = require(path.join(process.cwd(), 'config'));
  let migrationsDir = path.join(process.cwd(), 'db', 'migrations');
  let migrator = new Migrate(config.db, migrationsDir);

  return migrator.run('new', name);
};
