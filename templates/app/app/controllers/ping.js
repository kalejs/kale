'use strict';

const Kale = require('kalejs');

class PingController extends Kale.Controller {

  ping() {
    this.ctx.status = 200;
    this.ctx.body = 'pong';
  }

}

module.exports = PingController;
