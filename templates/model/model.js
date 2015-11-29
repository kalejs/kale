'use strict';

const bookshelf = require('../../db');

const KaleRecord = bookshelf.Model.extend({
  tableName: 'kale_records',
  hasTimestamps: true
});

module.exports = bookshelf.model('KaleRecord', KaleRecord);
