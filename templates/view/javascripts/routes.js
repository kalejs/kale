'use strict';

angular.module('KALE_NAME_CLASSApp')
  .config([ '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('PLURAL_NAME_LOWERCASE_DASHED', {
          url:'/PLURAL_NAME_LOWERCASE_DASHED',
          templateUrl:'/assets/views/PLURAL_NAME_LOWERCASE_DASHED/index.html',
          controller:'PLURAL_NAME_CAPITALIZEDIndexController',
          resolve: {
            PLURAL_NAME_LOWERCASE: ['$q', 'SINGULAR_NAME_CAPITALIZED', function($q, SINGULAR_NAME_CAPITALIZED) {
              var deferred = $q.defer();

              SINGULAR_NAME_CAPITALIZED.get(function(body) {
                deferred.resolve(body.PLURAL_NAME_LOWERCASE);
              }, function() {
                deferred.resolve([]);
              });

              return deferred.promise;
            }]
          }
        })
        .state('newSINGULAR_NAME_CAPITALIZED', {
          url:'/PLURAL_NAME_LOWERCASE_DASHED/new',
          templateUrl:'/assets/views/PLURAL_NAME_LOWERCASE_DASHED/new.html',
          controller:'PLURAL_NAME_CAPITALIZEDNewController'
        })
        .state('showSINGULAR_NAME_CAPITALIZED', {
          url:'/PLURAL_NAME_LOWERCASE_DASHED/:id',
          templateUrl:'/assets/views/PLURAL_NAME_LOWERCASE_DASHED/show.html',
          controller:'PLURAL_NAME_CAPITALIZEDShowController',
          resolve: {
            SINGULAR_NAME_LOWERCASE: ['$q', '$state', '$stateParams', 'SINGULAR_NAME_CAPITALIZED',
              function($q, $state, $stateParams, SINGULAR_NAME_CAPITALIZED) {
                var deferred = $q.defer();

                SINGULAR_NAME_CAPITALIZED.get({ id: $stateParams.id }, function(body) {
                  deferred.resolve(body.SINGULAR_NAME_LOWERCASE);
                }, function() {
                  deferred.reject();
                  $state.go('PLURAL_NAME_LOWERCASE');
                });

                return deferred.promise;
              }
            ]
          }
        })
        .state('editSINGULAR_NAME_CAPITALIZED', {
          url:'/PLURAL_NAME_LOWERCASE_DASHED/:id/edit',
          templateUrl:'/assets/views/PLURAL_NAME_LOWERCASE_DASHED/edit.html',
          controller:'PLURAL_NAME_CAPITALIZEDEditController',
          resolve: {
            SINGULAR_NAME_LOWERCASE: ['$q', '$state', '$stateParams', 'SINGULAR_NAME_CAPITALIZED',
              function($q, $state, $stateParams, SINGULAR_NAME_CAPITALIZED) {
                var deferred = $q.defer();

                SINGULAR_NAME_CAPITALIZED.get({ id: $stateParams.id }, function(body) {
                  deferred.resolve(body.SINGULAR_NAME_LOWERCASE);
                }, function() {
                  deferred.reject();
                  $state.go('PLURAL_NAME_LOWERCASE');
                });

                return deferred.promise;
              }
            ]
          }
        });
    }
  ]);
