'use strict';

const s = require('underscore.string');
const pluralize = require('pluralize');

class InflectableString extends String {
  /**
   * Returns the raw string, singular
   *
   * Example
   *  new StringInflector('things').singular();
   *  => 'thing'
   */
  singular() {
    return new this(pluralize.singular(this));
  }

  plural() {
    return new this(pluralize.plural(this));
  }

  camelcase() {
    return new this(s.camelize(this));
  }

  classify() {
    return new this(s.classify(this));
  }

  underscored() {
    return new this(s.underscored(this));
  }

  dasherized() {
    return new this(s.dasherize(this));
  }

  /**
   * Alias for str.singular().classify();
   *
   * Example
   *  AppName
   */
  className() {
    return this.singular().classify();
  }

  /**
   * Alias for str.plural().classify();
   *
   * Example
   *  AppNames
   */
  pluralClassName() {
    return str.plural().classify();
  }

  /**
   * Alias for str.singular().camelize();
   *
   * Example
   *  appName
   */
  camelCasedName() {
    return this.singular().camelize();
  }

  /**
   * Alias for str.singular().underscored();
   *
   * Example
   *  app_name
   */
  underscoredName() {
    return this.singular().underscored();
  }

  /**
   * Alias for str.plural().underscored();
   *
   * Example
   *  app_names
   */
  pluralUnderscoredName() {
    return this.plural().underscored();
  }

  /**
   * Alias for this.underscoredName().toUpperCase();
   *
   * Example
   *  APP_NAME
   */
  constantName() {
    return new this(this.underscoredName().toUpperCase());
  }

  /**
   * Alias for this.underscoredName().dasherized();
   *
   * Example
   *  app-name
   */
  dasherizedName() {
    return this.underscoredName().dasherized();
  }
}
