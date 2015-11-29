'use strict';

angular.module('app.controllers')
  .controller('KaleRecordsNewController', ['$scope', '$state', '$stateParams', 'KaleRecord',
    function($scope, $state, $stateParams, KaleRecord) {
      $scope.kaleRecord = new KaleRecord();

      $scope.create = function() {
        $scope.kaleRecord.$save(function() {
          $state.go('kaleRecords.index');
        });
      };
    }
  ]);
