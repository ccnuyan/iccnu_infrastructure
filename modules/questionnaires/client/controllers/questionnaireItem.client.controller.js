'use strict';

// Create the 'chat' controller
angular.module('questionnaire').controller('QuestionnaireItemController',
    ['$scope', '$state', 'Socket', 'Questionnaire', '$stateParams', '$modal', 'Authentication', 'toastr', '$http',
        function ($scope, $state, Socket, Questionnaire, $stateParams, $modal, Authentication, toastr, $http) {

            $scope.authentication = Authentication;

            $scope.showQrCode = function () {
                $modal.open({
                    animation: true,
                    templateUrl: 'qrCode.modal.client.view.html',
                    controller: 'QrCodeModalController'
                });
            };

            $scope.clear = function () {
                $http.put('/api/questionnaires/clear/' + $scope.questionnaire._id, null).then(function (ret) {
                    $scope.questionnaire = ret.data;
                    $scope.questionnaireImage = $scope.questionnaire.image._id;
                    $scope.total = total();
                });
            };

            $scope.choices = [
                {key: 'A', choiceType: 'success', choiceClass: ''},
                {key: 'B', choiceType: 'info', choiceClass: ''},
                {key: 'C', choiceType: 'warning', choiceClass: ''},
                {key: 'D', choiceType: 'primary', choiceClass: ''},
                {key: 'E', choiceType: 'success', choiceClass: 'progress-striped'},
                {key: 'F', choiceType: 'info', choiceClass: 'progress-striped'},
                {key: 'G', choiceType: 'warning', choiceClass: 'progress-striped'},
                {key: 'H', choiceType: 'primary', choiceClass: 'progress-striped'}];

            var questionnaireId = $stateParams.questionnaire;

            var total = function () {
                return $scope.questionnaire.choiceA +
                    $scope.questionnaire.choiceB +
                    $scope.questionnaire.choiceC +
                    $scope.questionnaire.choiceD +
                    $scope.questionnaire.choiceE +
                    $scope.questionnaire.choiceF +
                    $scope.questionnaire.choiceG +
                    $scope.questionnaire.choiceH;
            };

            $scope.find = function () {
                $scope.questionnaire = Questionnaire.info({questionnaireId: questionnaireId}, function () {
                    $scope.questionnaireImage = $scope.questionnaire.image._id;
                    $scope.total = total();

                    if ($scope.authentication.user._id === $scope.questionnaire.user) {
                        $scope.submitted = true;
                    }
                });
            };

            // Add an event listener to the 'chatMessage' event
            Socket.on('update', function (questionnaire) {
                $scope.questionnaire = questionnaire;
                $scope.total = total();
            });

            // Create a controller method for sending messages
            $scope.submit = function (choice) {
                // Create a new message object
                var submission = {
                    questionnaireId: questionnaireId,
                    choice: choice
                };

                // Emit a 'chatMessage' message event
                Socket.emit('submit', submission);

                $scope.submitted = true;

                toastr.success('已提交：' + choice);
            };

            // Remove the event listener when the controller instance is destroyed
            $scope.$on('$destroy', function () {
                Socket.removeListener('update');
            });
        }
    ]);
