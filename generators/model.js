'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var templatePath = path.join(__dirname, '..', 'templates', 'model');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

function _template(name) {
  return fs.readFileSync(path.join(templatePath, name), 'utf8');
}

function _exists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch(e) {
    return false;
  }
}

function _generateMigration(tableName) {
  var name = `create_${tableName}`;
  var migrationGenerator = require('./migration');
  var migrationDir = path.join(process.cwd(), 'db', 'migrations');

  if (!_exists(migrationDir)) {
    console.log(`ERROR: Unable to locate the ${migrationDir} directory`);
    return;
  }

  migrationGenerator(name).then(() => {
    var files = fs.readdirSync(migrationDir);
    var file = _.findLast(files, function(filename) {
      return _.endsWith(filename, `${name}.js`);
    });

    fs.writeFileSync(path.join(migrationDir, file), _migrationTemplate(tableName));
  });
}

function _migrationTemplate(tableName) {
  return _template('migration.js').replace(/kale_records/g, tableName);
}

function _modelTemplate(className, tableName) {
  return _template('model.js')
    .replace(/KaleRecord/g, className)
    .replace(/kale_records/g, tableName);
}

function _indexTemplate(dir) {
  let template = _template('index.js');

  let files = fs.readdirSync(dir);
  let requires = [];

  _.each(files, function(file) {
    if (_.str.isBlank(file) || file === 'index.js' || _.str.startsWith(file, '.')) {
      return;
    }

    let name = file.split('.')[0];
    let className = _.str.classify(name);
    requires.push(`  ${className}: require('./${name}'),`);
  });

  return template.replace('// FILES', requires.join('\n'));
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
