'use strict';

angular.module('resources').directive('knowledgeNodeUnit', function () {
    return {
        templateUrl: '/modules/resources/views/knowledgeNode.template.client.view.html',
        restrict: 'E',
        scope: {
            knowledgeNode: '=knowledgeNode'
        },
        controller: function ($scope) {
            $scope.knowledgeNode.displayPower = $scope.knowledgeNode.power * 10;
        }
    };
});
