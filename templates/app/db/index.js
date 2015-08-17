'use strict';

var knexfile = require('./knexfile');
var knex = require('knex')(knexfile);
var bookshelf = require('bookshelf')(knex);
var securePassword = require('bookshelf-secure-password');

bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');
bookshelf.plugin(securePassword);

module.exports = bookshelf;
