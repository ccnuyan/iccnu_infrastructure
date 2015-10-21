'use strict';

angular.module('resources').factory('NormalResource', ['$resource',
    function ($resource) {
        return $resource('api/resources/:resourceId', {
            resourceId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);

angular.module('resources').factory('ResourceByFile', ['$resource',
    function ($resource) {
        return $resource('api/resourceByFile/:fileId', {
            fileId: '@fileId'
        }, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);

angular.module('resources').factory('ResourceByTempFile', ['$resource',
    function ($resource) {
        return $resource('api/resourceByTempFile/:tempFileId', {
            tempFileId: '@tempFileId'
        }, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);

angular.module('resources').factory('ResourceByLink', ['$resource',
    function ($resource) {
        return $resource('api/resourceByLink/', null, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);

angular.module('resources').factory('ResAdminResource', ['$resource',
    function ($resource) {
        return $resource('api/rsadmin/resources/:resourceId', {
            resourceId: '@_id'
        }, {
            query: {
                method: 'get',
                isArray: false
            }
        });
    }
]);
