'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const str = require('underscore.string');
const Database = require('./database');

/**
 * Defines the Kale.Model class to be extended on a per-model basis
 *
 */
class Model extends Database.Model {

  /**
   * Returns the database schema name to be used for the model. This
   * method returns a undefined by default. If any value is returned
   * the schema will be joined to the table name using a `.` in the
   * `tableName` definition.
   *
   * @returns {String|undefined} The schema name
   */
  get schemaName() {

  }

  /**
   * Returns the database table name to be used for the model. The
   * name is inferred based on the model name, underscoring and
   * pluralizing the name.
   *
   * @example
   * class BlogPost extends Kale.Model {}
   * let blogPost = new BlogPost();
   * blogPost.tableName
   * // => "blog_posts"
   *
   * @returns {String} The table name
   */
  get tableName() {
    let modelName = this.constructor.name;
    let underscored = str.underscored(modelName);
    let pluralized = pluralize(underscored);

    return _.compact([this.schemaName, pluralized]).join('.');
  }

  /**
   * Returns the `id` column/attribute on the model
   *
   * @type {string}
   */
  get idAttribute() {
    return 'id';
  }
}

Model.register = Database.model;

module.exports = Model;
