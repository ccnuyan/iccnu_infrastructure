'use strict';

// Create the 'chat' controller
angular.module('questionnaire').controller('MyQuestionnairesController', ['Authentication', '$scope', '$state', 'Socket', 'Questionnaire', '$modal',
    function (Authentication, $scope, $state, Socket, Questionnaire, $modal) {

        $scope.authentication = Authentication;

        $scope.choices = [
            {key: 'A', choiceType: 'success', choiceClass: ''},
            {key: 'B', choiceType: 'info', choiceClass: ''},
            {key: 'C', choiceType: 'warning', choiceClass: ''},
            {key: 'D', choiceType: 'primary', choiceClass: ''},
            {key: 'E', choiceType: 'success', choiceClass: 'progress-striped'},
            {key: 'F', choiceType: 'info', choiceClass: 'progress-striped'},
            {key: 'G', choiceType: 'warning', choiceClass: 'progress-striped'},
            {key: 'H', choiceType: 'primary', choiceClass: 'progress-striped'}];

        if (!$scope.authentication.user) {
            return $state.go('home');
        }

        $scope.user = Authentication.user;

        $scope.questionnaires = [];

        $scope.find = function () {
            $scope.questionnaires = Questionnaire.query(function () {
                $scope.questionnaires.forEach(function (questionnaire) {
                    questionnaire.total = questionnaire.choiceA +
                        questionnaire.choiceB +
                        questionnaire.choiceC +
                        questionnaire.choiceD +
                        questionnaire.choiceE +
                        questionnaire.choiceF +
                        questionnaire.choiceG +
                        questionnaire.choiceH;
                });
            });
        };

        $scope.remove = function (questionnaire) {
            questionnaire.$remove();

            $scope.questionnaires.splice($scope.questionnaires.indexOf(questionnaire), 1);
        };
    }
]); 
