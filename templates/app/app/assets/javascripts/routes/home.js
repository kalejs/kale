'use strict';

angular.module('app')
  .config([ '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/assets/views/home/index.html',
          controller: 'HomepageController',
        });
    }
  ]);
