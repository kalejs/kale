'use strict';

angular.module('app.controllers')
  .controller('PLURAL_NAME_CAPITALIZEDShowController', ['$scope', 'SINGULAR_NAME_LOWERCASE',
    function($scope, SINGULAR_NAME_LOWERCASE) {
      $scope.SINGULAR_NAME_LOWERCASE = SINGULAR_NAME_LOWERCASE;
    }
  ]);
