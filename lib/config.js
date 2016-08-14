'use strict';

const _ = require('lodash');
const path = require('path');

/**
 * The environment-specific config loader.
 *
 * It loads the .env file first, then loads all.js
 * From there, it will load the config file named
 * after the current environment, and deep merge that
 * into all.js
 *
 * If there is a *.local.js file, it will be used for
 * local machine specific config
 *
 */
class Config {
  /**
   * Create a KaleConfig instance
   *
   * @param {Object} options
   * @param {String} options.root - The root path of the project
   * @param {String} options.environmentDir - The path to the environment directory
   */
  constructor(options) {
    try {
      require('dotenv').config({ path: path.join(options.root, '.env') }).load();
    } catch(e) {}

    this.environmentDir = options.environmentDir;
  }

  get all() {
    return this._load('all');
  }

  get environmentName() {
    return process.env.NODE_ENV || 'development';
  }

  get env() {
    return this._load(this.environmentName);
  }

  get local() {
    return this._load(this.environmentName + '.local');
  }

  /**
   * The compiled config
   *
   * @returns {Object} The config
   */
  get config() {
    return _.merge({}, this.all, this.env, this.local, {
      env: this.environmentName
    });
  }

  _load(env) {
    try {
      return require(path.join(this.environmentDir, env));
    } catch(err) {
      return {};
    }
  }
}

module.exports = Config;
