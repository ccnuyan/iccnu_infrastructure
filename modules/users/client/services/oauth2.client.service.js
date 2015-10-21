'use strict';

// Authentication service for user variables
angular.module('users').factory('Oauth2', ['$location', '$http',
    function ($location, $http) {

        var oauth2 = {};
        var oauth2url = '/api/oauth2';

        oauth2.getResponseType = function () {
            var url = $location.$$absUrl;
            var index = url.indexOf('response_type');
            if (index > 0 && url.length >= (index + 18)) {
                var code = url.substr(index + 14, 4);
                return code;
            } else {
                return null;
            }
        };

        oauth2.getSearch = function () {
            var search = $location.search();
            return search;
        };

        oauth2.me = function () {
            return $http.get(oauth2url + '/me');
        };

        oauth2.authorize = function (search) {
            return $http.get(oauth2url + '/authorize?' +
                'response_type=' + search.response_type +
                '&client_id=' + search.client_id +
                '&redirect_uri=' + search.redirect_uri +
                '&state=' + search.state
            );
        };

        return oauth2;
    }
]);
