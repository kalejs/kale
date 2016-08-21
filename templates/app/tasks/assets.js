'use strict';

const broccoli = require('broccoli');
const brocfile = require('../Brocfile.js');
const copyDereferenceSync = require('copy-dereference').sync;
const del = require('del');
const gulp = require('gulp');
const Watcher = require('broccoli-sane-watcher');

gulp.task('assets:build', function() {
  let builder = new broccoli.Builder(brocfile);

  return builder.build()
    .then(function(output) {
      del.sync(['public/assets/**']);
      copyDereferenceSync(output.directory, 'public/assets');
      del.sync([output.directory]);
      return output;
    });
});

gulp.task('assets:watch', function() {
  let builder = new broccoli.Builder(brocfile);
  let watcher = new Watcher(builder, { interval: 100 });

  return watcher.on('change', function(output) {
    console.log('\n\nChange detected');
    del.sync(['public/assets/**']);
    copyDereferenceSync(output.directory, 'public/assets');
    console.log('Build successful\n');
    watcher.emit('livereload');
  });
});

