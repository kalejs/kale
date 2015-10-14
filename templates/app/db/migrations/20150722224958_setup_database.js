'use strict';

exports.up = function(knex) {
  return knex.schema.raw('CREATE EXTENSION "pgcrypto";');
};

exports.down = function(knex) {
  return knex.schema.raw('DROP EXTENSION IF EXISTS "pgcrypto";');
};
