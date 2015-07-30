'use strict';

var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var s = require('underscore.string');
var templatePath = path.join(__dirname, '..', 'templates', 'app');

function copyAppTemplate(appPath, callback) {
  fs.copy(templatePath, appPath, callback);
}

function installDotfiles(appPath, callback) {
  var dotfilesPath = path.join(appPath, 'dotfiles');
  var files = fs.readdirSync(dotfilesPath);

  async.each(files, function(filename, next) {
    var filePath = path.join(dotfilesPath, filename);
    var destPath = path.join(appPath, `.${filename}`);

    fs.move(filePath, destPath, { clobber: true }, next);
  }, callback);
}

function deleteDotfilesTemplate(appPath, callback) {
  var dotfilesPath = path.join(appPath, 'dotfiles');
  fs.remove(dotfilesPath, callback);
}

function walkSync(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];

  files.forEach(function(file) {
    var filename = path.join(dir, file);

    if (fs.statSync(filename).isDirectory()) {
      filelist = walkSync(filename, filelist);
    } else {
      if (!s.startsWith(file, '.')) {
        filelist.push(filename);
      }
    }
  });

  return filelist;
}

function replaceAllPlaceholdersWithAppName(appPath, appName, callback) {
  var dirs = [
    path.join(appPath, 'app'),
    path.join(appPath, 'bin'),
    path.join(appPath, 'config'),
  ];

  var files = [
    path.join(appPath, 'package.json'),
    path.join(appPath, 'README.md'),
  ];

  dirs.forEach(function(dir) {
    files = files.concat(walkSync(dir));
  });

  async.each(files, function(filename, next) {
    replacePlaceholderWithAppName(filename, appName, next);
  }, callback);
}

function replacePlaceholderWithAppName(filename, appName, callback) {
  var underscored = s.underscored(appName);
  var className = s.classify(underscored);
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
        .replaceAll('KALE_NAME_CLASS', className)
        .replaceAll('KALE_NAME_UNDERSCORED', underscored)
        .replaceAll('KALE_NAME', appName);

      fs.writeFile(filename, replacedContent, next);
    }
  ], callback);
}

String.prototype.replaceAll = function(find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};

module.exports = function(appName) {
  var appPath = path.join('.', appName);

  async.series([
      function (next) {
        copyAppTemplate(appPath, next);
      },
      function (next) {
        installDotfiles(appPath, next);
      },
      function (next) {
        deleteDotfilesTemplate(appPath, next);
      },
      function (next) {
        replaceAllPlaceholdersWithAppName(appPath, appName, next);
      }
  ], function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`New kale.js app created at ./${appPath}`);
    console.log('');
    console.log(`Before starting, cd into ${appPath} and run ./bin/setup`);
    process.exit(0);
  });
};
