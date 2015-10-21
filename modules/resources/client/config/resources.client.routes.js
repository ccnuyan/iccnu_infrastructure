'use strict';

angular.module('resources').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
            state('resources', {
                abstract: true,
                url: '/resources',
                template: '<ui-view/>'
            }).
            state('resources.search', {
                url: '/search',
                templateUrl: 'modules/resources/views/resourceSearcher.client.view.html'
            }).
            state('resources.mine', {
                url: '/mine',
                templateUrl: 'modules/resources/views/myResources.client.view.html'
            }).
            state('resources.review', {
                url: '/review',
                templateUrl: 'modules/resources/views/rsAdminResources.client.view.html'
            }).
            state('resources.importer', {
                url: '/import',
                templateUrl: 'modules/resources/views/rsAdminImporter.client.view.html'
            });
    }
]);
