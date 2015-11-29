'use strict';

angular.module('app.controllers')
  .controller('KaleRecordsEditController', ['$scope', '$state', 'KaleRecord', 'kaleRecord',
    function($scope, $state, KaleRecord, kaleRecord) {
      $scope.kaleRecord = kaleRecord;

      $scope.update = function() {
        new KaleRecord($scope.kaleRecord).$update(function() {
          $state.go('kaleRecords.index');
        });
      };
    }
  ]);
