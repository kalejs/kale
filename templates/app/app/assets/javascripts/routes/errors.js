'use strict';

angular.module('app')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('errors', {
        abstract: true,
        templateUrl: '/assets/views/layouts/application.html'
      })
      .state('errors.404', {
        templateUrl: '/assets/views/errors/404.html',
        controller: 'ErrorsController'
      });
  }]);
