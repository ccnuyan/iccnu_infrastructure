'use strict';

angular.module('disk').factory('Directory', ['$resource',
    function ($resource) {
        return $resource('api/disk/:directoryId', {
            directoryId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);
