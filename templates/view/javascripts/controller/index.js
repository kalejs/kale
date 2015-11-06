'use strict';

angular.module('app.controllers')
  .controller('PLURAL_NAME_CAPITALIZEDIndexController', ['$scope', '$state', 'SINGULAR_NAME_CAPITALIZED', 'PLURAL_NAME_LOWERCASE',
    function($scope, $state, SINGULAR_NAME_CAPITALIZED, PLURAL_NAME_LOWERCASE) {
      $scope.PLURAL_NAME_LOWERCASE = PLURAL_NAME_LOWERCASE;

      $scope.destroy = function(SINGULAR_NAME_LOWERCASE) {
        SINGULAR_NAME_CAPITALIZED.delete({ id: SINGULAR_NAME_LOWERCASE.id }, function() {
          $state.go($state.current, {}, { reload: true });
        });
      };

    }
  ]);
