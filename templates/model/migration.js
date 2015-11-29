'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('kale_records', function(t) {
    t.uuid('id').primary().defaultsTo(knex.raw('gen_random_uuid()'));

    t.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('kale_records');
};

