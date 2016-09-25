'use strict';

const _ = require('lodash');
const fs = require('fs-extra-promise');
const path = require('path');
const templatePath = path.join(__dirname, '..', 'templates', 'model');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

/**
 * @returns {Promise}
 */
function _template(name) {
  return fs.readFile(path.join(templatePath, name), 'utf8');
}

function _exists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch(e) {
    return false;
  }
}

/**
 * @returns {Promise}
 */
function _generateMigration(tableName) {
  let name = `create_${tableName}`;
  let migrationGenerator = require('./migration');
  let migrationDir = path.join(process.cwd(), 'db', 'migrations');

  if (!_exists(migrationDir)) {
    console.log(`ERROR: Unable to locate the ${migrationDir} directory`);
    return;
  }

  return migrationGenerator(name)
    .then(() => {
      let files = fs.readdirSync(migrationDir);
      let file = _.findLast(files, function(filename) {
        return _.endsWith(filename, `${name}.js`);
      });

      return fs.writeFile(path.join(migrationDir, file), _migrationTemplate(tableName));
    });
}

/**
 * @returns {Promise}
 */
function _migrationTemplate(tableName) {
  return _template('migration.js').then((template) => {
    return template.replace(/kale_records/g, tableName);
  });
}

/**
 * @returns {Promise}
 */
function _modelTemplate(className, tableName) {
  return _template('model.js')
    .then((template) => {
      return template.replace(/KaleRecord/g, className).replace(/kale_records/g, tableName);
    });
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
