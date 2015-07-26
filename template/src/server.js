'use strict';

var app = require('./app');
var config = require('./config');

app.listen(config.port, function() {
  console.log(`Kale.js server (${config.env}) listening on port ${config.port}`);
  console.log(`available at http://localhost:${config.port}/`);
});
