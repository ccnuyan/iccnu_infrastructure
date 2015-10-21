'use strict';

angular.module('friends').factory('Group', ['$resource',
    function ($resource) {
        return $resource('api/groups/:groupId', {
            groupId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: false
            },
            update: {
                method: 'put'
            }
        });
    }
]);

