'use strict';

const _ = require('lodash');
const KoaRouter = require('koa-router');

/**
 * The Kale.Router class is a wrapper over koa-router intended to
 * provide extra functionality, and to work in a clean fashion with
 * Kale.Controller instances.
 *
 */
class Router extends KoaRouter {

  /**
   * Generate RESTful routes for a given controller
   *
   * @example
   * let router = new Kale.Router();
   * router.resources('users', controller.Users);
   * // GET /users
   * // GET /users/:id
   * // POST /users
   * // PUT /users/:id
   * // DELETE /users/:id
   *
   * @example
   * let router = new Kale.Router();
   * router.resources('users', controller.Users, { only: ['index', 'show'] });
   * // GET /users
   * // GET /users/:id
   *
   * @example
   * let router = new Kale.Router();
   * router.resources('users', controller.Users, { only: 'show' });
   * // GET /users/:id
   *
   * @example
   * let router = new Kale.Router();
   * router.resources('users', controller.Users, { except: ['index', 'show'] });
   * // POST /users
   * // PUT /users/:id
   * // DELETE /users/:id
   *
   * @example
   * let router = new Kale.Router();
   * router.resources('users', controller.Users, { except: 'destroy' });
   * // GET /users
   * // GET /users/:id
   * // POST /users
   * // PUT /users/:id
   *
   * @param {string} path - The base path for the router
   * @param {Function} [middleware] - List of middleware
   * @param {Kale.Controller} controller - The controller for the resource
   * @param {Object} [opts] - Optional configuration options for the resource
   * @param {Array|String} [opts.except] - An action or list of actions to exclude from the resource routing. Note: `only` takes precendence over `except`
   * @param {Array|String} [opts.only] - A action or list of actions to include in the resource routing. Note: `only` takes precendence over `except`
   */
  resources(path, ...args) {
    let routes = ['index', 'show', 'create', 'update', 'destroy'];
    let opts = {};
    let controller;
    let middleware;

    if (_.isPlainObject(args[args.length - 1])) {
      opts = args.pop();
    }

    if (!path.startsWith('/')) {
      path = `/${path}`;
    }

    controller = args.pop();

    if (!controller) {
      throw new Error(`Invalid router resource declaration for ${path}. Missing controller`);
    }

    middleware = args;

    if (opts && opts.only) {
      routes = _.flattenDeep([opts.only]);
    } else if (opts && opts.except) {
      routes = _.difference(routes, _.flattenDeep([opts.except]));
    }

    if (routes.includes('index')) {
      this.get.apply(this, [path].concat(middleware, [controller.index()]));
    }

    if (routes.includes('show')) {
      this.get.apply(this, [`${path}/:id`].concat(middleware, [controller.show()]));
    }

    if (routes.includes('create')) {
      this.post.apply(this, [path].concat(middleware, [controller.create()]));
    }

    if (routes.includes('update')) {
      this.put.apply(this, [`${path}/:id`].concat(middleware, [controller.update()]));
    }

    if (routes.includes('destroy')) {
      this.delete.apply(this, [`${path}/:id`].concat(middleware, [controller.destroy()]));
    }

    return this;
  }

}

module.exports = Router;
