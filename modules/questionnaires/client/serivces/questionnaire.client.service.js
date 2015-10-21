'use strict';

angular.module('questionnaire').factory('Questionnaire', ['$resource',
    function ($resource) {
        return $resource('api/questionnaires/:questionnaireId', {
            questionnaireId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: true
            },
            update: {
                method: 'put'
            },
            info: {
                method: 'get',
                isArray: false
            }
        });
    }
]);

