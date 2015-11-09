'use strict';

var assetRev = require('broccoli-asset-rev');
var browserify = require('broccoli-fast-browserify');
var env = process.env.BROCCOLI_ENV || 'development';
var funnel = require('broccoli-funnel');
var less = require('broccoli-less-single');
var mergeTrees = require('broccoli-merge-trees');
var uglifyJs = require('broccoli-uglify-js');

/*
 * javascript
 */
var js = browserify('app/assets/javascripts', {
  browserify: {
    debug: env === 'development'
  },
  bundles: {
    'application.js': {
      entryPoints: ['application.js']
    }
  }
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
var css = less('app/assets/stylesheets', 'application.css.less', 'application.css', {
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
