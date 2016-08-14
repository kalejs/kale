'use strict';

const Koa = require('koa');
const _ = require('lodash');
const body = require('koa-json-body');
const cors = require('kcors');
const database = require('./database');
const helmet = require('koa-helmet');
const json = require('koa-json');
const logger = require('koa-morgan');
const path = require('path');
const serve = require('koa-static');
const uuid = require('node-uuid');

/**
 * Kale.App is the base Kale application class. It extends Koa() to include
 * many helpful features to bootstrap a new application, including:
 *
 * * Logging
 * * Security Headers (via helmet)
 * * CORS policy
 * * Environment-specific config (available via ctx.app.config)
 * * Error handling
 * * Routing (via Kale.Router)
 *
 * @example
 * const app = new Kale.App();
 */
class App extends Koa {
  /**
   * Builds a Koa.App instance.
   *
   * @param {Object} [opts] - Configuration for the app instance
   * @param {String} [opts.root="./app"] - The root of the app directory, where Kale.App is initialized
   * @param {String} [opts.config="../config"] - The path to the app config
   * @param {String} [opts.models="./models"] - The path to the models directory
   * @param {String} [opts.public="../public"] - The path to the public assets directory
   * @param {String} [opts.routes="./routes"] - The path to the routes file (or directory)
   */
  constructor(opts) {
    super();

    let root = opts && opts.root;

    if (!root) {
      try {
        // Attempt the file that included the Kale index file via require('kale');
        root = path.dirname(module.parent.parent.filename);
        throw('err');
      } catch(_) {
        // Fallback assuming normal node_modules structure in a typical Kale.js app structure
        root = path.join(__dirname, '..', '..', '..', 'app');
      }
    }

    this.context._options = _.defaults(opts, {
      config: path.join(root, '..', 'config'),
      models: path.join(root, 'models'),
      public: path.join(root, '..', 'public'),
      routes: path.join(root, 'routes'),
    });

    database.connect(this.config.db);

    this.use(logger(this.config.logging.format));
    this.use(helmet());
    this.use(cors(this.config.cors));
    this.use(body());
    this.use(json(this.config.json));

    this.use((ctx, next) => {
      ctx.config = this.config;
      ctx.models = this.models;
      ctx.state.requestId = uuid.v4();
      return next();
    });

    this.use(this.router.routes());
    this.use(this.router.allowedMethods());

    this.use(serve(this.context._options.public));
  }

  /**
   * Lazy load the environment-specific configuration.
   *
   * @returns {Object} The environment specific configuration for the app
   */
  get config() {
    return this._lazyLoad('config', this.context._options.config);
  }

  /**
   * Lazy load the models directory
   *
   * @returns {Object.<string, Kale.Model>} An object containing all the models
   */
  get models() {
    return this._lazyLoad('models', this.context._options.models);
  }

  /**
   * Lazy load the router from the routes directory
   *
   * @returns {Kale.Router} The router
   */
  get router() {
    return this._lazyLoad('router', this.context._options.routes);
  }

  /**
   * Lazy-load a cacheable file
   *
   * @private
   * @param {String} name - The name of the lazy-loadable, cacheable file
   * @param {String} filePath - The path to the file
   *
   * @returns {*} The lazy-loaded value, if any
   */
  _lazyLoad(name, filePath) {
    let file;

    if (this._cache(name)) {
      return this._cache(name);
    }

    try {
      file = require(filePath);
    } catch(e) {
      console.error(`Unable to load ${name} file from: '${filePath}':`, e);
      throw e;
    }

    return this._cache(name, file);
  }

  /**
   * Get or set a cached value.
   *
   * @private
   * @param {String} name - The name of the cached object
   * @param {*} [value] - The vale to cache
   *
   * @returns {*} The cached value, if any
   */
  _cache(name, value) {
    this.context._cache = this.context._cache || {};

    if (arguments.length > 1) {
      this.context._cache[name] = value;
    }

    return this.context._cache[name];
  }
}

module.exports = App;
