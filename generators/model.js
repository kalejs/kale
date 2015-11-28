'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

function _generateMigration(tableName) {
  var name = `create_${tableName}`;
  var migrationGenerator = require('./migration');
  var migrationDir = path.join('.', 'db', 'migrations');

  migrationGenerator(name);

  var files = fs.readdirSync(migrationDir);
  var file = _.findLast(files, function(filename) {
    return _.endsWith(filename, `${name}.js`);
  });

  fs.writeFileSync(path.join(migrationDir, file), _migrationTemplate(tableName));
}

function _migrationTemplate(tableName) {
  return `'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('${tableName}', function(t) {
    t.uuid('id').primary().defaultsTo(knex.raw('gen_random_uuid()'));

    t.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('${tableName}');
};
`;
}

function _modelTemplate(className, tableName) {
  return `'use strict';

const bookshelf = require('../../db');

const ${className} = bookshelf.Model.extend({
  tableName: '${tableName}',
  hasTimestamps: true
});

module.exports = bookshelf.model('${className}', ${className});
`;
}

function _indexTemplate(dir) {
  var template = `'use strict';

module.exports = {
[FILES]
};
`;

  var files = fs.readdirSync(dir);
  var requires = [];

  _.each(files, function(file) {
    if (_.str.isBlank(file) || file === 'index.js' || _.str.startsWith(file, '.')) {
      return;
    }

    var name = file.split('.')[0];
    var className = _.str.classify(name);
    requires.push(`  ${className}: require('./${name}'),`);
  });

  return template.replace('[FILES]', requires.join('\n'));
}

module.exports = function(name) {
  var className = _.str.classify(name);
  var underscored = _.str.underscored(name);
  var camelized = _.str.camelize(underscored);
  var tableName = _.str.inflection.pluralize(underscored);
  var modelsDir = path.join('.', 'app', 'models');

  var filePath = path.join(modelsDir, camelized + '.js');
  var indexPath = path.join(modelsDir, 'index.js');

  fs.writeFileSync(filePath, _modelTemplate(className, tableName));
  fs.writeFileSync(indexPath, _indexTemplate(modelsDir));
  _generateMigration(tableName);

  console.log(`${className} model written to ${filePath}`);
};
