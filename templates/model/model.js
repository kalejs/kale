'use strict';

const bookshelf = require('../../db');

const KaleClass = bookshelf.Model.extend({
  tableName: 'kale_records',
  hasTimestamps: true
});

module.exports = bookshelf.model('KaleClass', KaleClass);
