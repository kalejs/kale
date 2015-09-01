'use strict';

module.exports = function *(next) {
  try {
    yield next;
  } catch (err) {
    console.log(err.stack);

    switch (err.status) {
      case 400:
        this.status = 400;
        this.body = { error: err.message };
        break;

      case 401:
        this.status = 401;
        this.body = { error: 'Unauthorized' };
        break;

      case 404:
        this.status = 404;
        this.body = { error: 'NotFound' };
        break;

      default:
        console.log(err.message);
        this.status = 500;
        this.body = { error: 'Internal Server Error' };
    }
  }
};
