'use strict';

angular.module('app.controllers')
  .controller('KaleRecordsIndexController', ['$scope', '$state', 'KaleRecord', 'kaleRecords',
    function($scope, $state, KaleRecord, kaleRecords) {
      $scope.kaleRecords = kaleRecords;

      $scope.destroy = function(kaleRecord) {
        KaleRecord.delete({ id: kaleRecord.id }, function() {
          $state.go($state.current, {}, { reload: true });
        });
      };

    }
  ]);
