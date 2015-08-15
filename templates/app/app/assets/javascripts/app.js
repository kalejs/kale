'use strict';

var angular = require('angular');

angular.module('KALE_NAME_CLASSApp', [
  'ui.router',
  'ngResource',
  'KALE_NAME_CLASSApp.controllers',
  'KALE_NAME_CLASSApp.services',
]);

angular.module('KALE_NAME_CLASSApp')
  .config(['$locationProvider', function($locationProvider) {
      $locationProvider.html5Mode(true);
  }]).run(['$state', function($state) {
    $state.go('home');
  }]);
