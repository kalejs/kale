'use strict';

const assetRev = require('broccoli-asset-rev');
const autoprefixer = require('broccoli-autoprefixer');
const BroccoliSass = require('broccoli-sass');
const browserify = require('broccoli-fast-browserify');
const env = process.env.BROCCOLI_ENV || 'development';
const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const uglifyJs = require('broccoli-uglify-js');

/**
 * Javascript
 */
let js = browserify('app/assets/javascripts', {
  browserify: {
    debug: env === 'development'
  },
  bundles: {
    'application.js': {
      entryPoints: ['application.js']
    },
    'vendor.js': {
      entryPoints: ['vendor.js']
    }
  }
});

if (env !== 'development') {
  js = uglifyJs(js, { compress: true, mangle: true });
}

js = funnel(js, {
  destDir: 'javascripts'
});

/**
 * Stylesheets (sass)
 */
let css = new BroccoliSass(['app/assets/stylesheets'], 'application.css.scss', 'application.css', {
  outputStyle: env === 'development' ? 'nested' : 'compressed'
});

let vendorCss = new BroccoliSass(['app/assets/stylesheets'], 'vendor.css.scss', 'vendor.css', {
  outputStyle: env === 'development' ? 'nested' : 'compressed'
});

css = mergeTrees([css, vendorCss]);

css = autoprefixer(css);

css = funnel(css, {
  destDir: 'stylesheets'
});

/**
 * Fonts
 */

let fonts = funnel('app/assets/fonts', {
  destDir: 'fonts'
});

let vendorFonts = funnel('node_modules/font-awesome/fonts', {
  destDir: 'fonts'
});

fonts = mergeTrees([fonts, vendorFonts]);


/**
 * Images
 */
let images = funnel('app/assets/images', {
  destDir: 'images'
});

/**
 * Views (HTML)
 */
let html = funnel('app/assets/views', {
  destDir: 'views'
});

/*
 * Asset Digest
 */
let assets = mergeTrees([js, css, images, html, fonts]);

assets = assetRev(assets, {
  extensions: ['js', 'css', 'png', 'jpg', 'gif', 'svg'],
  replaceExtensions: ['html', 'js', 'css'],
  generateAssetMap: true
});

module.exports = assets;
