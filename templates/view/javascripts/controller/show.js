'use strict';

angular.module('app.controllers')
  .controller('KaleRecordsShowController', ['$scope', 'kaleRecord',
    function($scope, kaleRecord) {
      $scope.kaleRecord = kaleRecord;
    }
  ]);
