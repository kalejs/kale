'use strict';

angular.module('app')
  .config([ '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('kaleRecords', {
          abstract: true,
          templateUrl: '/assets/views/layouts/application.html'
        })
        .state('kaleRecords.index', {
          url: '/kale-records',
          templateUrl: '/assets/views/kaleRecords/index.html',
          controller: 'KaleRecordsIndexController',
          resolve: {
            kaleRecords: ['$q', 'KaleRecord', function($q, KaleRecord) {
              var deferred = $q.defer();

              KaleRecord.get(function(body) {
                deferred.resolve(body.kaleRecords);
              }, function() {
                deferred.resolve([]);
              });

              return deferred.promise;
            }]
          }
        })
        .state('kaleRecords.new', {
          url: '/kale-records/new',
          templateUrl: '/assets/views/kaleRecords/new.html',
          controller: 'KaleRecordsNewController'
        })
        .state('kaleRecords.show', {
          url: '/kale-records/:id',
          templateUrl: '/assets/views/kaleRecords/show.html',
          controller: 'KaleRecordsShowController',
          resolve: {
            kaleRecord: ['$q', '$state', '$stateParams', 'KaleRecord',
              function($q, $state, $stateParams, KaleRecord) {
                var deferred = $q.defer();

                KaleRecord.get({ id: $stateParams.id }, function(body) {
                  deferred.resolve(body.kaleRecord);
                }, function() {
                  deferred.reject();
                  $state.go('kaleRecords');
                });

                return deferred.promise;
              }
            ]
          }
        })
        .state('kaleRecords.edit', {
          url: '/kale-records/:id/edit',
          templateUrl: '/assets/views/kaleRecords/edit.html',
          controller: 'KaleRecordsEditController',
          resolve: {
            kaleRecord: ['$q', '$state', '$stateParams', 'KaleRecord',
              function($q, $state, $stateParams, KaleRecord) {
                var deferred = $q.defer();

                KaleRecord.get({ id: $stateParams.id }, function(body) {
                  deferred.resolve(body.kaleRecord);
                }, function() {
                  deferred.reject();
                  $state.go('kaleRecords');
                });

                return deferred.promise;
              }
            ]
          }
        });
    }
  ]);
