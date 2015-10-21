'use strict';

angular.module('template').directive('responsiveTitle', function () {
    return {
        templateUrl: '/modules/core/views/responsiveTitle.template.client.view.html',
        restrict: 'E',
        scope: {
            responsiveTitle: '=responsiveTitle'
        },
        controller: function ($scope) {
        }
    };
});
