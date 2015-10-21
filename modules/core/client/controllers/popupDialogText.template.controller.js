'use strict';

angular.module('template').directive('popupDialogText', function () {
    return {
        templateUrl: '/modules/core/views/popupDialogText.template.client.view.html',
        restrict: 'E',
        scope: {
            title: '@popupButtonTitle',
            placeHolder: '@popupPlaceHolder',
            parentSubmit: '&onSubmit',
            content: '=textContent'
        },
        controller: function ($scope) {
            $scope.submit = function () {
                $scope.parentSubmit();
            };
        }
    };
});
