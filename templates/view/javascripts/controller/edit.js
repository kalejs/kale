'use strict';

angular.module('app.controllers')
  .controller('PLURAL_NAME_CAPITALIZEDEditController', ['$scope', '$state', 'SINGULAR_NAME_CAPITALIZED', 'SINGULAR_NAME_LOWERCASE',
    function($scope, $state, SINGULAR_NAME_CAPITALIZED, SINGULAR_NAME_LOWERCASE) {
      $scope.SINGULAR_NAME_LOWERCASE = SINGULAR_NAME_LOWERCASE;

      $scope.update = function() {
        new SINGULAR_NAME_CAPITALIZED($scope.SINGULAR_NAME_LOWERCASE).$update(function() {
          $state.go('PLURAL_NAME_LOWERCASE.index');
        });
      };
    }
  ]);
