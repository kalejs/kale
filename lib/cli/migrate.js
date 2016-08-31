#!/usr/bin/env node

'use strict';

const Knex = require('knex');

class Migrate {
  constructor(config, migrationsDir) {
    this.knex = new Knex(config);
    this.migrationsDir = migrationsDir;
  }

  run(action, name) {
    if (!action) {
      return this.up();
    }

    switch (action) {
      case 'new':
      case 'g':
      case 'generate':
        return this.create(name);

      case 'down':
      case 'rollback':
        return this.down();

      case 'up':
        return this.up();

      default:
        return this.usage();
    }
  }

  create(name) {
    if (!name) {
      console.log('Please provide a name for the migration');
      return Promise.reject();
    }

    return this.knex.migrate.make(name, {
      directory: this.migrationsDir
    });
  }

  up() {
    return this.knex.migrate.latest({
      directory: this.migrationsDir
    });
  }

  down() {
    return this.knex.migrate.rollback({
      directory: this.migrationsDir
    });
  }

  usage() {
    console.log('Usage:');
    console.log('./bin/migrate new [name] - Generate a new migration file in ./db/migrations');
    console.log('./bin/migrate up         - Migrate to the latest version');
    console.log('./bin/migrate down       - Migrate down one version');
    return Promise.resolve();
  }
}


module.exports = Migrate;
