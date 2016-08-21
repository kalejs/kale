'use strict';

const controllers = require('./controllers');
const Kale = require('kalejs');

let router = new Kale.Router({ prefix: '/api/v1' });

router.get('/ping', controllers.Ping.action('ping'));

router.use((ctx) => {
  ctx.status = 404;
});

module.exports = router;
