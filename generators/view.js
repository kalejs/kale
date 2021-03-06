'use strict';

var _ = require('lodash');
var async = require('async');
var fs = require('fs-extra');
var path = require('path');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

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

function replaceContentsInDirs(dirs, names, callback) {
  var files = [];

  dirs.forEach(function(dir) {
    files = files.concat(walkSync(dir));
  });

  async.each(files, function(filename, next) {
    replaceContents(filename, names, next);
  }, callback);
}

function replaceContents(filename, names, callback) {
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
        .replaceAll('KaleRecord', names.singular.capitalized)
        .replaceAll('kaleRecord', names.singular.lowercase)
        .replaceAll('KaleRecords', names.plural.capitalized)
        .replaceAll('kale-records', names.plural.lowercaseDashed)
        .replaceAll('kaleRecords', names.plural.lowercaseCamelized)
        .replaceAll('kaleRecords', names.plural.lowercase);

      fs.writeFile(filename, replacedContent, next);
    }
  ], callback);
}

function installJavascript(names, callback) {
  var templatePath = path.join(__dirname, '..', 'templates', 'view');
  var assetsPath = path.join('.', 'app', 'assets', 'javascripts');
  var controller = path.join(templatePath, 'javascripts', 'controller');
  var routes = path.join(templatePath, 'javascripts', 'routes.js');
  var service = path.join(templatePath, 'javascripts', 'service.js');

  async.series([
    function controllersDir(next) {
      fs.copy(controller, path.join(assetsPath, 'controllers', `${names.plural.lowercaseCamelized}`), next);
    },
    function controllersReplace(next) {
      replaceContentsInDirs([path.join(assetsPath, 'controllers', `${names.plural.lowercaseCamelized}`)], names, next);
    },
    function controllersIndex(next) {
      var index = path.join(assetsPath, 'controllers', 'index.js');
      fs.appendFile(index, `require('./${names.plural.lowercaseCamelized}');\n`, next);
    },
    function controllerFile(next) {
      fs.copy(`${controller}.js`, path.join(assetsPath, 'controllers', `${names.plural.lowercaseCamelized}.js`), next);
    },
    function controllerReplace(next) {
      replaceContents(path.join(assetsPath, 'controllers', `${names.plural.lowercaseCamelized}.js`), names, next);
    },

    function routesFile(next) {
      fs.copy(routes, path.join(assetsPath, 'routes', `${names.plural.lowercaseCamelized}.js`), next);
    },
    function routesReplace(next) {
      replaceContents(path.join(assetsPath, 'routes', `${names.plural.lowercaseCamelized}.js`), names, next);
    },
    function routesIndex(next) {
      var index = path.join(assetsPath, 'routes', 'index.js');
      fs.appendFile(index, `require('./${names.plural.lowercaseCamelized}');\n`, next);
    },

    function serviceFile(next) {
      fs.copy(service, path.join(assetsPath, 'services', `${names.plural.lowercaseCamelized}.js`), next);
    },
    function serviceReplace(next) {
      replaceContents(path.join(assetsPath, 'services', `${names.plural.lowercaseCamelized}.js`), names, next);
    },
    function serviceIndex(next) {
      var index = path.join(assetsPath, 'services', 'index.js');
      fs.appendFile(index, `require('./${names.plural.lowercaseCamelized}');\n`, next);
    }
  ], callback);
}

function installViews(names, callback) {
  var templatePath = path.join(__dirname, '..', 'templates', 'view');
  var viewsPath = path.join(templatePath, 'views');
  var outputPath = path.join('.', 'app', 'assets', 'views', `${names.plural.lowercaseCamelized}`);

  async.series([
    function copyViews(next) {
      fs.copy(viewsPath, outputPath, next);
    },
    function viewReplace(next) {
      replaceContentsInDirs([outputPath], names, next);
    }
  ], callback);
}


module.exports = function(plural) {
  var camelized = _.str.camelize(plural);
  var singular = _.str.inflection.singularize(camelized);
  var className = _.str.classify(singular);

  var names = {
    singular: {
      lowercase: singular,
      capitalized: className
    },
    plural: {
      lowercase: plural,
      lowercaseDashed: _.str.dasherize(plural),
      lowercaseCamelized: camelized,
      capitalized: _.str.classify(plural)
    }
  };

  async.series([
    function javascript(next) {
      installJavascript(names, next);
    },
    function views(next) {
      installViews(names, next);
    }
  ], function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`${names.plural.capitalized} views written`);
  });
};
