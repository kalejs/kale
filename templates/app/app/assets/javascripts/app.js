'use strict';

require('angular');
require('angular-resource');
require('angular-ui-router');

angular.module('app', [
  'ui.router',
  'ngResource',
  'app.controllers',
  'app.services'
]);

require('./controllers');
require('./routes');
require('./services');

angular.module('app')
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }]).run(['$state', function($state) {
    $state.go('home');
  }]);

