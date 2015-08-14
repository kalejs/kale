'use strict';

var path = require('path');
var send = require('koa-send');

function _isAssetsPath(path) {
  return /^\/assets/.test(path);
}

module.exports = function *(next) {
  if (_isAssetsPath(this.path)) {
    yield send(this, this.path, { root: path.join(this.config.root, 'app') });
    return;
  }

  yield next;
};
