'use strict';

angular.module('friends').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
            state('friends', {
                abstract: true,
                url: '/friends',
                template: '<ui-view/>'
            }).
            state('friends.list', {
                url: '/list',
                templateUrl: 'modules/friends/views/myFriends.client.view.html'
            })
            .state('friends.share', {
                url: '/share/:friend',
                templateUrl: 'modules/friends/views/friendShare.client.view.html'
            });

        $stateProvider.
            state('groups', {
                abstract: true,
                url: '/groups',
                template: '<ui-view/>'
            })
            .state('groups.list', {
                url: '/list',
                templateUrl: 'modules/friends/views/myGroups.client.view.html'
            })
            .state('groups.group', {
                url: '/:group',
                templateUrl: 'modules/friends/views/group.client.view.html'
            });
    }
]);
