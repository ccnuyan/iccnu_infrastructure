'use strict';

angular.module('resources').controller('RsAdminResourcesController',
    ['$scope', '$http', 'ResAdminResource', 'Authentication', '$state',
        function ($scope, $http, ResAdminResource, Authentication, $state) {

            $scope.authentication = Authentication;

            if (!$scope.authentication.user) {
                return $state.go('home');
            }

            $scope.container = {};

            $scope.find = function () {
                var pageNo = 1;
                $scope.container = ResAdminResource.query({
                    status: 'submitted',
                    page: pageNo,
                    perPage: 10
                });
            };

            $scope.pageChanged = function () {
                var pageNo = $scope.container.page;
                $scope.container = ResAdminResource.query({
                    status: 'submitted',
                    page: pageNo,
                    perPage: 10
                });
            };

            $scope.$on('resourceDecided', function (event, response) {
                var pageNo = $scope.container.page;
                $scope.container = ResAdminResource.query({
                    page: pageNo,
                    perPage: 10
                });
            });
        }
    ]);
