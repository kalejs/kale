'use strict';

const Knex = require('knex');
const Bookshelf = require('bookshelf-latest-master');
const bookshelf = new Bookshelf(new Knex({}));

bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');

/**
 * Method to initialize a `knex` instance for the bookshelf
 * instance.
 *
 * @param {Object} config - the database configuration
 * @returns {Bookshelf}
 */
bookshelf.connect = function(config) {
  let oldKnex = this.knex;
  this.knex = new Knex(config);
  oldKnex.destroy();
  return bookshelf;
};

module.exports = bookshelf;
