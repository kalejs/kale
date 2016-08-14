'use strict';

/**
 * The Kale.Controller class is a parent class intended to be sublcassed
 * for all Kale-based applications.
 *
 * Kale.Controller provides some basic helper methods and is designed to
 * work with the Kale.Router.
 *
 * Each Kale.Controller instance is initialized during the request cycle
 * and contains the Koa context object (this.ctx) to help maintan state
 * throughout the request lifecycle.
 *
 * Subclasses should define instance methods for each action that will
 * be called via the Kale.Router.  For example, a RESTful controller
 * subclass would define the standard CRUD methods:
 * 'index()', 'show()', 'create()', 'update()', 'destroy()'.
 *
 * It is not necessary to overwrite the static CRUD methods on this class,
 * they are primarily convenience methods.
 *
 * @example
 * class MyController extends Kale.Controller {
 *   index() {
 *     this.ctx.body = 'The GET / index() method';
 *   }
 *
 *   show() {
 *     this.ctx.body = `The GET /${this.ctx.param.id} show() method`;
 *   }
 *
 *   create() {
 *     this.ctx.body = 'The POST / create() method';
 *   }
 *
 *   update() {
 *     this.ctx.body = `The PUT /${this.ctx.param.id} update() method`;
 *   }
 *
 *   destroy() {
 *     this.ctx.body = `The DELETE /${this.ctx.param.id} update() method`;
 *   }
 * }
 */
class Controller {
  /**
   * Builds a new Kale.Controller instance
   *
   * @param {Object} ctx - The Koa context object
   * @param {Function} [next] - The next middleware function pointer provided by Koa
   */
  constructor(ctx, next) {
    this.ctx = ctx;
    this.next = next;
  }

  /**
   * A helper method to call action('index')
   *
   * @returns {Function} The result of action('index');
   */
  static index() {
    return this.action('index');
  }

  /**
   * A helper method to call action('show')
   *
   * @returns {Function} The result of action('show');
   */
  static show() {
    return this.action('show');
  }

  /**
   * A helper method to call action('create')
   *
   * @returns {Function} The result of action('create');
   */
  static create() {
    return this.action('create');
  }

  /**
   * A helper method to call action('update')
   *
   * @returns {Function} The result of action('update');
   */
  static update() {
    return this.action('update');
  }

  /**
   * A helper method to call action('destroy')
   *
   * @returns {Function} The result of action('destroy');
   */
  static destroy() {
    return this.action('destroy');
  }

  /**
   * A helper method to initialize a new Kale.Controller subclass,
   * and call the given action (method) upon it.
   *
   * @example
   * Controller.action('ping');
   * // Is the equivalent of calling:
   * // let controller = new Controller(ctx, next);
   * // controller.ping();
   *
   * @param {String} name - the action (method) name
   */
  static action(name) {
    return (ctx, next) => {
      let controller = new this(ctx, next);

      if (!controller[name]) {
        // TODO: Handle this more efficiently
        return '404';
      }

      return controller[name]();
    };
  }
}

module.exports = Controller;
