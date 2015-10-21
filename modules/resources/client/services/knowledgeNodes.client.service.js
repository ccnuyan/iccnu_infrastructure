'use strict';

angular.module('resources').factory('KnowledgeNodes', ['$resource',
    function ($resource) {
        return $resource('api/knowledgeNodes', {
            resourceId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: true
            }
        });
    }
]);
