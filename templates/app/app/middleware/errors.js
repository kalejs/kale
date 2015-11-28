'use strict';

module.exports = (ctx, next) => {
  return next().catch((err) => {
    switch (err.status) {
      case 400:
        ctx.status = 400;
        ctx.body = { error: err.message };
        break;

      case 401:
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized' };
        break;

      case 404:
        ctx.status = 404;
        ctx.body = { error: 'Not Found' };
        break;

      default:
        console.log(err.stack);
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
    }
  });
};
