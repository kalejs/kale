'use strict';

angular.module('app.services')
  .factory('KaleRecord', ['$resource', function($resource) {
    return $resource('/api/v1/kale-records/:id', { id: '@id' }, {
      update: {
        method: 'PUT'
      }
    });
  }]);
