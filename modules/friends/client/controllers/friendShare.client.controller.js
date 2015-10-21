'use strict';

angular.module('friends').controller('FriendShareController',
    ['$scope', '$stateParams', '$location', '$resource', '$modal', 'Authentication', 'Friend', 'File', 'SharedFiles', 'toastr',
        function ($scope, $stateParams, $location, $resource, $modal, Authentication, Friend, File, SharedFiles, toastr) {

            $scope.user = Authentication.user;
            $scope.container = {};

            $scope.init = function () {
                SharedFiles.query({targetId: $stateParams.friend}, function (data) {
                    $scope.container = data;
                });
            };
        }
    ]);
