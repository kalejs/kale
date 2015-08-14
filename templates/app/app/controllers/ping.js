'use strict';

var ping = function *() {
  this.status = 200;
  this.body = 'pong';
};

module.exports = {
  ping: ping
};
