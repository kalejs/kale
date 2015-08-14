'use strict';

var path = require('path');

module.exports = {
  appName: 'KALE_NAME',

  db: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '..', '..', 'db', 'migrations'),
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  json: {
    pretty: false,
    spaces: 2
  },

  logging: {
    format: 'common'
  },

  port: process.env.PORT || 3000,
  root: path.join(__dirname, '..', '..')
};
