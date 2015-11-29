'use strict';

angular.module('app.controllers')
  .controller('FooterController', ['$scope', function($scope) {
    $scope.year = new Date().getFullYear();
  }]);
