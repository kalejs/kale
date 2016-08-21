'use strict';

angular.module('app', [
  'ui.router',
  'ngResource',
  'app.controllers',
  'app.directives',
  'app.services'
]);

require('./controllers');
require('./directives');
require('./routes');
require('./services');

angular.module('app')
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }])
  .config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector, $location) {
      var state = $injector.get('$state');
      state.go('errors.404');
      return $location.path();
    });
  }])
  .run(['$state', function($state) {
    $state.go('home.show');
  }]);

