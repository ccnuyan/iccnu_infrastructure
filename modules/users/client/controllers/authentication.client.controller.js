'use strict';

angular.module('users').controller('AuthenticationController', ['$window', '$state', '$scope', '$http', '$location', 'Authentication',
    function ($window, $state, $scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        // OAuth provider request
        $scope.callOauthProvider = function (url) {

            var redirect_to;

            if ($state.previous) {
                redirect_to = $state.previous.href;
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
        };
    }
]);
