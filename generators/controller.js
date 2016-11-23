'use strict';

const _ = require('lodash');
const fs = require('fs');
const InflectableString = require('./support/inflectableString');
const path = require('path');
const templatePath = path.join(__dirname, '..', 'templates', 'controller');

function _template(name) {
  return fs.readFileSync(path.join(templatePath, name), 'utf8');
}

function _emptyControllerTemplate() {
  return _template('empty.js');
}

function _controllerTemplate(inflectable) {
  let template = _template('controller.js');

  return template
    .replace(/KaleRecord/g, inflectable.className())
    .replace(/kaleRecords/g, inflectable.pluralCamelCasedName())
    .replace(/kaleRecord/g, inflectable.camelCasedName());
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
    let classifiedName = _.str.classify(name);
    requires.push(`  ${classifiedName}: require('./${name}'),`);
  });

  return template.replace('// FILES', requires.join('\n'));
}

function _routerTemplate(inflectable) {
  return _template('routes.js')
    .replace(/kale-records/g, inflectable.pluralDasherizedName())
    .replace(/KaleRecords/g, inflectable.pluralClassName())
    .replace(/kaleRecords/g, inflectable.pluralCamelCasedName());
}

function _writeRoutes(inflectable) {
  let routesPath = path.join('.', 'app', 'routes.js');
  let template = _routerTemplate(inflectable);

  let routes = fs.readFileSync(routesPath, 'utf8');
  let lines = routes.split('\n');

  let routerDefinition = _.findLastIndex(lines, function(text) {
    return _.str.startsWith(text, 'let router');
  });

  let endOfRouterDefinition = _.findIndex(lines, function(text) {
    return _.str.isBlank(text);
  }, routerDefinition);

  lines.splice(endOfRouterDefinition, 0, template);

  fs.writeFileSync(routesPath, lines.join('\n'));
}

module.exports = function(name, options) {
  let inflectable = new InflectableString(name);
  let controllersDir = path.join('.', 'app', 'controllers');
  let filePath = path.join(controllersDir, inflectable.pluralCamelCasedName() + '.js');
  let indexPath = path.join(controllersDir, 'index.js');
  let template;

  if (options.empty) {
    template = _emptyControllerTemplate();
  } else {
    template = _controllerTemplate(inflectable);
  }

  fs.writeFileSync(filePath, template);
  fs.writeFileSync(indexPath, _indexTemplate(controllersDir));

  if (!options.empty) {
    _writeRoutes(inflectable);
  }

  console.log(`Controller written to ${filePath}`);
};
