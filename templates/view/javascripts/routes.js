'use strict';

var angular = require('angular');

angular.module('KALE_NAME_CLASSApp')
  .config([ '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('users', {
          url:'/users',
          templateUrl:'/assets/views/users/index.html',
          controller:'UsersIndexController',
          resolve: {
            users: ['$q', 'User', function($q, User) {
              var deferred = $q.defer();

              User.get(function(body) {
                deferred.resolve(body.users);
              }, function() {
                deferred.resolve([]);
              });

              return deferred.promise;
            }]
          }
        })
        .state('newUser', {
          url:'/users/new',
          templateUrl:'/assets/views/users/new.html',
          controller:'UsersNewController'
        })
        .state('showUser', {
          url:'/users/:id',
          templateUrl:'/assets/views/users/show.html',
          controller:'UsersShowController',
          resolve: {
            user: ['$q', '$state', '$stateParams', 'User',
              function($q, $state, $stateParams, User) {
                var deferred = $q.defer();

                User.get({ id: $stateParams.id }, function(body) {
                  deferred.resolve(body.user);
                }, function() {
                  deferred.reject();
                  $state.go('users');
                });

                return deferred.promise;
              }
            ]
          }
        })
        .state('editUser', {
          url:'/users/:id/edit',
          templateUrl:'/assets/views/users/edit.html',
          controller:'UsersEditController',
          resolve: {
            user: ['$q', '$state', '$stateParams', 'User',
              function($q, $state, $stateParams, User) {
                var deferred = $q.defer();

                User.get({ id: $stateParams.id }, function(body) {
                  deferred.resolve(body.user);
                }, function() {
                  deferred.reject();
                  $state.go('users');
                });

                return deferred.promise;
              }
            ]
          }
        });
    }
  ]);

