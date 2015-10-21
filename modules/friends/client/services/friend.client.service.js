'use strict';

angular.module('friends').factory('Friend', ['$resource',
    function ($resource) {
        return $resource('api/friends/:targetId', {
            targetId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: false
            },
            submit: {
                method: 'post',
                isArray: false
            },
            decide: {
                method: 'put',
                isArray: false
            }
        });
    }
]);


angular.module('friends').factory('FriendInfo', ['$resource',
    function ($resource) {
        return $resource('api/friendSearch/:username', {
            username: '@username'
        }, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);


angular.module('friends').factory('SharedFiles', ['$resource',
    function ($resource) {
        return $resource('api/share/:targetId', {
            targetId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);

