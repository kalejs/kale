'use strict';

angular.module('app')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('home', {
        abstract: true,
        templateUrl: '/assets/views/layouts/application.html'
      })
      .state('home.show', {
        url: '/',
        templateUrl: '/assets/views/home/index.html',
        controller: 'HomepageController'
      });
  }]);
