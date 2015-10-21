'use strict';

angular.module('template').directive('confirmOrCancel', function () {
    return {
        templateUrl: '/modules/core/views/confirmOrCancel.template.client.view.html',
        restrict: 'E',
        scope: {
            flagConfirm: '@optConfirm',
            parentConfirm: '&optConfirm',
            confirmTitle: '@confirmTitle',

            flagCancel: '@optCancel',
            parentCancel: '&optCancel',
            cancelTitle: '@cancelTitle'
        },
        controller: function ($scope) {
            $scope.isCanceled = false;

            if ($scope.flagConfirm)
                $scope.onConfirm = function () {
                    $scope.parentConfirm();
                };

            if ($scope.flagCancel)
                $scope.onCancel = function () {

                    $scope.parentCancel();
                };
        }
    };
});
