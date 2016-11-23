'use strict';

const _ = require('lodash');
const fs = require('fs');
const InflectableString = require('./support/inflectableString');
const path = require('path');
const templatePath = path.join(__dirname, '..', 'templates', 'model');

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

function _generateMigration(inflectable) {
  var name = `create_${inflectable.pluralUnderscoredName()}`;
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

    fs.writeFileSync(path.join(migrationDir, file), _migrationTemplate(inflectable));
  });
}

function _migrationTemplate(inflectable) {
  return _template('migration.js')
    .replace(/kale_records/g, inflectable.pluralUnderscoredName());
}

function _modelTemplate(inflectable) {
  return _template('model.js')
    .replace(/KaleRecord/g, inflectable.className())
    .replace(/kale_records/g, inflectable.pluralUnderscoredName());
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
  let inflectable = new InflectableString(name);
  let modelsDir = path.join('.', 'app', 'models');

  let filePath = path.join(modelsDir, inflectable.camelCasedName() + '.js');
  let indexPath = path.join(modelsDir, 'index.js');

  fs.writeFileSync(filePath, _modelTemplate(inflectable));
  fs.writeFileSync(indexPath, _indexTemplate(modelsDir));
  _generateMigration(inflectable);

  console.log(`Model written to ${filePath}`);
  process.exit(0);
};
