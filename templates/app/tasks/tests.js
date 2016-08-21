'use strict';

const gulp = require('gulp');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const path = require('path');
const src = path.join('**', '*.js');

gulp.task('default', ['test']);
gulp.task('test', ['jshint', 'jscs']);

gulp.task('jshint', function() {
  gulp.src(src)
    .pipe(jshint())
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  gulp.src(src)
    .pipe(jscs());
});
