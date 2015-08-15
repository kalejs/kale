'use strict';

var angular = require('angular');

angular.module('KALE_NAME_CLASSApp.controllers', [])
  .controller('UsersIndexController', ['$scope', '$state', 'User', 'users',
    function($scope, $state, User, users) {
      $scope.users = users;

      $scope.destroy = function(user) {
        User.delete({ id: user.id }, function() {
          $state.go($state.current, {}, { reload: true });
        });
      };

    }
  ])

  .controller('UsersShowController', ['$scope', 'user',
    function($scope, user) {
      $scope.user = user;
    }
  ])

  .controller('UsersNewController', ['$scope', '$state', '$stateParams', 'User',
    function($scope, $state, $stateParams, User) {
      $scope.user = new User();

      $scope.create = function() {
        $scope.user.$save(function() {
          $state.go('users');
        });
      };
    }
  ])

  .controller('UsersEditController', ['$scope', '$state', 'user',
    function($scope, $state, user) {
      $scope.user = user;

      $scope.update = function() {
        $scope.user.$update(function() {
          $state.go('users');
        });
      };
    }
  ]);
