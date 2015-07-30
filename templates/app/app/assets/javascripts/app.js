'use strict';

angular.module('KALE_NAME_CLASSApp', [
  'ui.router',
  'ngResource',
  'KALE_NAME_CLASSApp.controllers',
  'KALE_NAME_CLASSApp.services',
]);

angular.module('KALE_NAME_CLASSApp')
  .config([ '$stateProvider', '$httpProvider', '$locationProvider',
    function($stateProvider,   $httpProvider,   $locationProvider) {

      $stateProvider
        .state
        .state('home', {
          url:'/',
          templateUrl:'/assets/views/home/index.html',
          controller:'HomepageController',
        });

      $locationProvider.html5Mode(true);
    }
  ]).run(['$state', function($state) {
    $state.go('home');
  }]);
