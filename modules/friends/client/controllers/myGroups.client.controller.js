'use strict';

angular.module('friends').controller('MyGroupsController',
    ['$scope', '$state', '$stateParams', '$location', '$resource', '$modal', 'Authentication', 'Group',
        function ($scope, $state, $stateParams, $location, $resource, $modal, Authentication, Group) {

            $scope.authentication = Authentication;

            if (!$scope.authentication.user) {
                return $state.go('home');
            }

            $scope.user = Authentication.user;

            $scope.find = function () {
                $scope.container = Group.query();
            };

            $scope.create = function (groupName) {
                var group = new Group({name: groupName});
                group.$save(function () {
                    $scope.find();
                });
            };
        }
    ]);
