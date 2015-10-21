'use strict';

// Configure the 'chat' module routes
angular.module('questionnaire').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
            state('questionnaires', {
                abstract: true,
                url: '/questionnaires',
                template: '<ui-view/>'
            }).
            state('questionnaires.list', {
                url: '/',
                templateUrl: 'modules/questionnaires/views/myQuestionnaires.client.view.html'
            }).
            state('questionnaires.questionnaire', {
                url: '/:questionnaire',
                templateUrl: 'modules/questionnaires/views/questionnaireItem.client.view.html'
            });
    }
]);
