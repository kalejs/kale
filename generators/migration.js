'use strict';

const Migrate = require('../lib/cli/migrate');
const path = require('path');
const config = require(path.join(process.cwd(), 'config'));
const root = process.cwd();

let migrator = new Migrate(config.db, root);

module.exports = function(name) {
  migrator.run('new', name);
};
