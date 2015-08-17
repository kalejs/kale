'use strict';

angular.module('KALE_NAME_CLASSApp.controllers', [])
  .controller('PLURAL_NAME_CAPITALIZEDIndexController', ['$scope', '$state', 'SINGULAR_NAME_CAPITALIZED', 'PLURAL_NAME_LOWERCASE',
    function($scope, $state, SINGULAR_NAME_CAPITALIZED, PLURAL_NAME_LOWERCASE) {
      $scope.PLURAL_NAME_LOWERCASE = PLURAL_NAME_LOWERCASE;

      $scope.destroy = function(SINGULAR_NAME_LOWERCASE) {
        SINGULAR_NAME_CAPITALIZED.delete({ id: SINGULAR_NAME_LOWERCASE.id }, function() {
          $state.go($state.current, {}, { reload: true });
        });
      };

    }
  ])

  .controller('PLURAL_NAME_CLASSShowController', ['$scope', 'SINGULAR_NAME_LOWERCASE',
    function($scope, SINGULAR_NAME_LOWERCASE) {
      $scope.SINGULAR_NAME_LOWERCASE = SINGULAR_NAME_LOWERCASE;
    }
  ])

  .controller('PLURAL_NAME_CLASSNewController', ['$scope', '$state', '$stateParams', 'SINGULAR_NAME_CAPITALIZED',
    function($scope, $state, $stateParams, SINGULAR_NAME_CAPITALIZED) {
      $scope.SINGULAR_NAME_LOWERCASE = new SINGULAR_NAME_CAPITALIZED();

      $scope.create = function() {
        $scope.SINGULAR_NAME_LOWERCASE.$save(function() {
          $state.go('PLURAL_NAME_LOWERCASE');
        });
      };
    }
  ])

  .controller('PLURAL_NAME_CLASSEditController', ['$scope', '$state', 'SINGULAR_NAME_LOWERCASE',
    function($scope, $state, SINGULAR_NAME_LOWERCASE) {
      $scope.SINGULAR_NAME_LOWERCASE = SINGULAR_NAME_LOWERCASE;

      $scope.update = function() {
        $scope.SINGULAR_NAME_LOWERCASE.$update(function() {
          $state.go('PLURAL_NAME_LOWERCASE');
        });
      };
    }
  ]);
