'use strict';

var assetRev = require('broccoli-asset-rev');
var browserify = require('broccoli-browserify');
var env = process.env.BROCCOLI_ENV || 'development';
var funnel = require('broccoli-funnel');
var less = require('broccoli-less-single');
var mergeTrees = require('broccoli-merge-trees');
var uglifyJs = require('broccoli-uglify-js');

/*
 * javascript (browserify, uglifyjs)
 */
var js = browserify('app/assets/javascripts', {
  entries: ['./app.js'],
  outputFile: 'app.js',
  browserify: { debug: env !== 'development' },
  transform: [
    'debowerify'
  ]
});

if (env !== 'development') {
  js = uglifyJs(js, { compress: true });
}

js = funnel(js, {
  destDir: 'javascripts'
});

/*
 * css (less)
 */
var css = less('app/assets/stylesheets', 'app.css.less', 'app.css', {
  paths: ['./app/assets/stylesheets', './app/assets/bower_components'],
  compress: env !== 'development'
});

css = funnel(css, {
  destDir: 'stylesheets'
});

/*
 * images
 */
var images = funnel('app/assets/images', {
  destDir: 'images'
});

/*
 * html
 */
var html = funnel('app/assets/views', {
  destDir: 'views'
});

/*
 * asset hash
 */
var assets = mergeTrees([js, css, images, html]);

assets = assetRev(assets, {
  extensions: ['js', 'css', 'png', 'jpg', 'gif', 'svg'],
  replaceExtensions: ['html', 'js', 'css'],
  generateAssetMap: true
});

module.exports = assets;
