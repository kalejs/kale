'use strict';

require('./assets');
require('./tests');

const gulp = require('gulp');

gulp.task('default', ['test']);
