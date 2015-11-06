'use strict';

angular.module('app.controllers')
  .controller('PLURAL_NAME_CAPITALIZEDNewController', ['$scope', '$state', '$stateParams', 'SINGULAR_NAME_CAPITALIZED',
    function($scope, $state, $stateParams, SINGULAR_NAME_CAPITALIZED) {
      $scope.SINGULAR_NAME_LOWERCASE = new SINGULAR_NAME_CAPITALIZED();

      $scope.create = function() {
        $scope.SINGULAR_NAME_LOWERCASE.$save(function() {
          $state.go('PLURAL_NAME_LOWERCASE.index');
        });
      };
    }
  ]);
