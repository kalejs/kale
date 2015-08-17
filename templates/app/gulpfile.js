'use strict';

var broccoli = require('broccoli');
var copyDereferenceSync = require('copy-dereference').sync;
var del = require('del');
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var path = require('path');
var src = path.join('**', '*.js');

gulp.task('default', ['jshint', 'jscs']);
gulp.task('test', ['jshint', 'jscs']);

gulp.task('jshint', function() {
  gulp.src(src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  gulp.src(src)
    .pipe(jscs());
});

gulp.task('assets:build', function() {
  var brocfile = require('./Brocfile.js');
  var builder = new broccoli.Builder(brocfile);

  return builder.build()
    .then(function(output) {
      del.sync(['public/assets/**']);
      copyDereferenceSync(output.directory, 'public/assets');
      del.sync([output.directory]);
      return output;
    });
});

gulp.task('assets:watch', function() {
  var brocfile = require('./Brocfile.js');
  var builder = new broccoli.Builder(brocfile);
  var watcher = new broccoli.Watcher(builder, { interval: 100 });

  return watcher.on('change', function(output) {
    console.log('\n\nChange detected');
    del.sync(['public/assets/**']);
    copyDereferenceSync(output.directory, 'public/assets');
    console.log('Build successful\n');
    watcher.emit('livereload');
  });
});

