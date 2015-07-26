'use strict';

var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var s = require('underscore.string');

function copyAppTemplate(appPath, callback) {
  var templatePath = path.join(__dirname, '..', 'template');
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

function replaceAllPlaceholdersWithAppName(appPath, appName, callback) {
  var files = [
    path.join(appPath, 'bin', 'setup'),
    path.join(appPath, 'knexfile.js'),
    path.join(appPath, 'package.json'),
    path.join(appPath, 'README.md'),
    path.join(appPath, 'src', 'config', 'environments', 'all.js')
  ];

  async.each(files, function(filename, next) {
    replacePlaceholderWithAppName(filename, appName, next);
  }, callback);
}

function replacePlaceholderWithAppName(filename, appName, callback) {
  var underscored = s.underscored(appName);
  var contents;

  async.series([
    function readFile(next) {
      fs.readFile(filename, 'utf8', function(err, _contents) {
        contents = _contents;
        next(err);
      });
    },
    function writeFile(next) {
      var replacedContent = contents.replaceAll('KALE_NAME_UNDERSCORED', underscored).replaceAll('KALE_NAME', appName);
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
