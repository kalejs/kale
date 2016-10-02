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
   * @param {Array|Function} [opts.middleware] - The middleware to use for this route
   */
  resources(path, ...args) {
    let router = this;
    let routes = ['index', 'show', 'create', 'update', 'destroy'];
    let opts = {};
    let controller;
    let middleware;

    if (_.isObject(args[args.length - 1])) {
      opts = args.pop();
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
      router.get.apply(router, [`/${path}`].concat(middleware, [controller.index()]));
    }

    if (routes.includes('show')) {
      router.get.apply(router, [`/${path}/:id`].concat(middleware, [controller.show()]));
    }

    if (routes.includes('create')) {
      router.post.apply(router, [`/${path}`].concat(middleware, [controller.create()]));
    }

    if (routes.includes('update')) {
      router.put.apply(router, [`/${path}/:id`].concat(middleware, [controller.update()]));
    }

    if (routes.includes('destroy')) {
      router.delete.apply(router, [`/${path}/:id`].concat(middleware, [controller.destroy()]));
    }

    return router;
  }

}

module.exports = Router;
