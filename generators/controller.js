'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var templatePath = path.join(__dirname, '..', 'templates', 'controller');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

function _template(name) {
  return fs.readFileSync(path.join(templatePath, name), 'utf8');
}

function _emptyControllerTemplate() {
  return _template('empty.js');
}

function _controllerTemplate(className, singular, plural) {
  let template = _template('controller.js');

  return template
    .replace(/KaleRecord/g, className)
    .replace(/kaleRecords/g, plural)
    .replace(/kaleRecord/g, singular);
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

function _routerTemplate(camelized) {
  let dasherized = _.str.dasherize(camelized);
  let classified = _.str.classify(dasherized);

  return _template('routes.js')
    .replace(/kale-records/g, dasherized)
    .replace(/KaleRecords/g, classified)
    .replace(/kaleRecords/g, camelized);
}

function _writeRoutes(camelized) {
  let routesPath = path.join('.', 'app', 'routes.js');
  let template = _routerTemplate(camelized);

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

module.exports = function(plural, options) {
  let camelized = _.str.camelize(plural);
  let singular = _.str.inflection.singularize(camelized);
  let className = _.str.classify(singular);

  let controllersDir = path.join('.', 'app', 'controllers');

  let filePath = path.join(controllersDir, camelized + '.js');
  let indexPath = path.join(controllersDir, 'index.js');

  let template;

  if (options.empty) {
    template = _emptyControllerTemplate();
  } else {
    template = _controllerTemplate(className, singular, camelized);
  }

  fs.writeFileSync(filePath, template);
  fs.writeFileSync(indexPath, _indexTemplate(controllersDir));

  if (!options.empty) {
    _writeRoutes(camelized);
  }

  console.log(`${camelized} controller written to ${filePath}`);
};
