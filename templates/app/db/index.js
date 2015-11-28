'use strict';

var knexfile = require('./knexfile');
var knex = require('knex')(knexfile);
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');

module.exports = bookshelf;
