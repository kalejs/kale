'use strict';

const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');
const InflectableString = require('./support/inflectableString');
const path = require('path');

function walkSync(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];

  files.forEach(function(file) {
    var filename = path.join(dir, file);

    if (fs.statSync(filename).isDirectory()) {
      filelist = walkSync(filename, filelist);
    } else {
      if (!_.str.startsWith(file, '.')) {
        filelist.push(filename);
      }
    }
  });

  return filelist;
}

function replaceContentsInDirs(dirs, inflectable, callback) {
  var files = [];

  dirs.forEach(function(dir) {
    files = files.concat(walkSync(dir));
  });

  async.each(files, function(filename, next) {
    replaceContents(filename, inflectable, next);
  }, callback);
}

function replaceContents(filename, inflectable, callback) {
  var contents;

  async.series([
    function readFile(next) {
      fs.readFile(filename, 'utf8', function(err, _contents) {
        contents = _contents;
        next(err);
      });
    },
    function writeFile(next) {
      var replacedContent = contents
        .replaceAll('KaleRecords', inflectable.pluralClassName())
        .replaceAll('kale-records', inflectable.pluralDasherizedName())
        .replaceAll('kaleRecords', inflectable.pluralCamelCasedName())
        .replaceAll('KaleRecord', inflectable.className())
        .replaceAll('kaleRecord', inflectable.camelCasedName());

      fs.writeFile(filename, replacedContent, next);
    }
  ], callback);
}

function installJavascript(inflectable, callback) {
  var templatePath = path.join(__dirname, '..', 'templates', 'view');
  var assetsPath = path.join('.', 'app', 'assets', 'javascripts');
  var controller = path.join(templatePath, 'javascripts', 'controller');
  var routes = path.join(templatePath, 'javascripts', 'routes.js');
  var service = path.join(templatePath, 'javascripts', 'service.js');

  async.series([
    function controllersDir(next) {
      fs.copy(controller, path.join(assetsPath, 'controllers', `${inflectable.pluralCamelCasedName()}`), next);
    },
    function controllersReplace(next) {
      replaceContentsInDirs([path.join(assetsPath, 'controllers', `${inflectable.pluralCamelCasedName()}`)], inflectable, next);
    },
    function controllersIndex(next) {
      var index = path.join(assetsPath, 'controllers', 'index.js');
      fs.appendFile(index, `require('./${inflectable.pluralCamelCasedName()}');\n`, next);
    },
    function controllerFile(next) {
      fs.copy(`${controller}.js`,path.join(assetsPath, 'controllers', `${inflectable.pluralCamelCasedName()}.js`), next);
    },
    function controllerReplace(next) {
      replaceContents(path.join(assetsPath, 'controllers', `${inflectable.pluralCamelCasedName()}.js`), inflectable, next);
    },

    function routesFile(next) {
      fs.copy(routes, path.join(assetsPath, 'routes', `${inflectable.pluralCamelCasedName()}.js`), next);
    },
    function routesReplace(next) {
      replaceContents(path.join(assetsPath, 'routes', `${inflectable.pluralCamelCasedName()}.js`), inflectable, next);
    },
    function routesIndex(next) {
      var index = path.join(assetsPath, 'routes', 'index.js');
      fs.appendFile(index, `require('./${inflectable.pluralCamelCasedName()}');\n`, next);
    },

    function serviceFile(next) {
      fs.copy(service, path.join(assetsPath, 'services', `${inflectable.pluralCamelCasedName()}.js`), next);
    },
    function serviceReplace(next) {
      replaceContents(path.join(assetsPath, 'services', `${inflectable.pluralCamelCasedName()}.js`), inflectable, next);
    },
    function serviceIndex(next) {
      var index = path.join(assetsPath, 'services', 'index.js');
      fs.appendFile(index, `require('./${inflectable.pluralCamelCasedName()}');\n`, next);
    }
  ], callback);
}

function installViews(inflectable, callback) {
  var templatePath = path.join(__dirname, '..', 'templates', 'view');
  var viewsPath = path.join(templatePath, 'views');
  var outputPath = path.join('.', 'app', 'assets', 'views', `${inflectable.pluralCamelCasedName()}`);

  async.series([
    function copyViews(next) {
      fs.copy(viewsPath, outputPath, next);
    },
    function viewReplace(next) {
      replaceContentsInDirs([outputPath], inflectable, next);
    }
  ], callback);
}


module.exports = function(name) {
  let inflectable = new InflectableString(name);

  async.series([
    function javascript(next) {
      installJavascript(inflectable, next);
    },
    function views(next) {
      installViews(inflectable, next);
    }
  ], function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`${name} views written`);
  });
};
