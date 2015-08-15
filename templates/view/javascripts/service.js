'use strict';

var angular = require('angular');

angular.module('KALE_NAME_CLASSApp.services', [])
  .factory('User', ['$resource', function($resource) {
    return $resource('/api/v1/users/:id', { id: '@id' }, {
      update: {
        method: 'PUT'
      }
    });
  }]);
