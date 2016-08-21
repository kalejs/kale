'use strict';

const Kale = require('kalejs');
const path = require('path');

let config = new Kale.Config({
  root: path.join(__dirname, '..'),
  environmentDir: path.join(__dirname, 'environments')
});

module.exports = config.config;
