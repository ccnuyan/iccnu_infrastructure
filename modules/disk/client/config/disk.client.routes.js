'use strict';

angular.module('disk').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
            state('disk', {
                abstract: true,
                url: '/disk',
                template: '<ui-view/>'
            }).
            state('disk.directory', {
                url: '/:directory',
                templateUrl: 'modules/disk/views/myDisk.client.view.html'
            });
    }
]);
