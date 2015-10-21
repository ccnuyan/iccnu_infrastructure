'use strict';

angular.module('resources').directive('knowledgeNodeList', function () {
    return {
        templateUrl: '/modules/resources/views/knowledgeNodeList.part.client.view.html',
        restrict: 'E',
        scope: {
            knowledgeNodes: '=knowledgeNodes',
            nullWarning: '=nullWarning',
            onClick: '=onClick'
        },
        controller: function ($scope) {
        }
    };
});
