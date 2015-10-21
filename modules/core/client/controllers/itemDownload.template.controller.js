'use strict';

angular.module('template').directive('itemDownload', function () {
    return {
        templateUrl: '/modules/core/views/itemDownload.template.client.view.html',
        restrict: 'E',
        scope: {
            downloadUrl: '@itemUrl',
            size: '@itemSize',
            showText: '@showText',
            downloading: '&downloading'
        },
        controller: function ($scope) {
            $scope.onClick = function () {
                if ($scope.downloading) {
                    $scope.downloading();
                }
            };
        }
    };
});
