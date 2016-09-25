'use strict';

const exec = require('child_process').exec;
const fs = require('fs-extra-promise');
const path = require('path');
const s = require('underscore.string');
const templatePath = path.join(__dirname, '..', 'templates', 'app');

/**
 * @returns {Promise}
 */
function copyAppTemplate(appPath) {
  return fs.copyAsync(templatePath, appPath);
}

/**
 * @returns {Promise}
 */
function installDotfiles(appPath) {
  let dotfilesPath = path.join(appPath, 'dotfiles');
  return fs.readdirAsync(dotfilesPath).then((files) => {
    console.log('here!');

    let promises = files.map((filename) => {
      let filePath = path.join(dotfilesPath, filename);
      let destPath = path.join(appPath, `.${filename}`);

      return fs.moveAsync(filePath, destPath, { clobber: true });
    });

    return Promise.all(promises);
  });
}

/**
 * @returns {Promise}
 */
function deleteDotfilesTemplate(appPath) {
  let dotfilesPath = path.join(appPath, 'dotfiles');
  return fs.removeAsync(dotfilesPath);
}

function walkSync(dir, filelist) {
  return fs.readdirAsync(dir).then((files) => {
    filelist = filelist || [];

    files.forEach(function(file) {
      var filename = path.join(dir, file);

      if (fs.isDirectorySync(filename)) {
        filelist = walkSync(filename, filelist);
      } else {
        if (!s.startsWith(file, '.')) {
          filelist.push(filename);
        }
      }
    });

    return filelist;
  });
}

/**
 * @returns {Promise}
 */
function replaceAllPlaceholdersWithAppName(appPath, appName) {
  let dirs = [
    path.join(appPath, 'app'),
    path.join(appPath, 'bin'),
    path.join(appPath, 'config'),
  ];

  let files = [
    path.join(appPath, 'package.json'),
    path.join(appPath, 'README.md'),
  ];

  dirs.forEach(function(dir) {
    files = files.concat(walkSync(dir));
  });

  let promises = files.map((filename) => {
    return replacePlaceholderWithAppName(filename, appName);
  });

  return Promise.all(promises);
}

/**
 * @returns {Promise}
 */
function replacePlaceholderWithAppName(filename, appName) {
  let underscored = s.underscored(appName);
  let dashed = s.dasherize(underscored);

  return fs.readFileAsync(filename, 'utf8')
    .then((contents) => {
      let replacedContent = contents
        .replaceAll('kale_records', underscored)
        .replaceAll('KALE_APP_NAME', appName)
        .replaceAll('KALE_DASHERIZED_NAME', dashed);

      return fs.writeFileAsync(filename, replacedContent);
    });
}

/**
 * @returns {Promise}
 */
function initializeGitRepo(appPath) {
  return new Promise((resolve, reject) => {
    exec(`git init ${appPath}`, (err) => {
      if (err) {
        return reject();
      }

      return resolve();
    });
  });
}

String.prototype.replaceAll = function(find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};

/**
 * @type {Promise}
 */
module.exports = function(appName) {
  let appPath = path.join(process.cwd(), '.', appName);

  return copyAppTemplate(appPath)
    .then(installDotfiles(appPath))
    .then(deleteDotfilesTemplate(appPath))
    .then(replaceAllPlaceholdersWithAppName(appPath, appName))
    .then(initializeGitRepo(appPath))
    .then(() => {
      console.log(`New kale.js app created at ./${appPath}`);
      console.log('');
      console.log(`Before starting, cd into ${appPath} and run 'npm run setup'`);
    })
    .catch((e) => {
      console.log('Error creating kale.js app');
      console.log(e, e.stack);
    });
};
