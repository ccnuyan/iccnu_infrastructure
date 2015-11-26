'use strict';

angular.module('users').controller('AuthenticationController', ['$window', '$state', '$scope', '$http', '$location', 'Authentication',
    function ($window, $state, $scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        // OAuth provider request
        $scope.callOauthProvider = function (url) {
            // If user is signed in then redirect back home
            $http.get('/api/auth/signout')
                .then(function(){
                    // Effectively call OAuth authentication route:
                    $window.location.href = url;
                }
            );
        };
    }
]);
