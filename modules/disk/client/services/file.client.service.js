'use strict';

angular.module('disk').factory('File', ['$resource',
    function ($resource) {
        return $resource('api/disk/:parent/:fileId', {
            fileId: '@_id',
            parent: '@parent'
        }, {
            update: {
                method: 'put'
            }
        });
    }
]);
