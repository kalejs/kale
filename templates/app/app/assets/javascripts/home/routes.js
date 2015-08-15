'use strict';

var angular = require('angular');

angular.module('KALE_NAME_CLASSApp')
  .config([ '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('home', {
          url:'/',
          templateUrl:'/assets/views/home/index.html',
          controller:'HomepageController',
        });
    }
  ]);
