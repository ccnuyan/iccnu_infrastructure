'use strict';

angular.module('resources').controller('MyResourcesController',
    ['$scope', '$modal', 'NormalResource', 'Authentication', '$state',
        function ($scope, $modal, NormalResource, Authentication, $state) {

            $scope.authentication = Authentication;

            if (!$scope.authentication.user) {
                return $state.go('home');
            }

            $scope.find = function () {
                var pageNo = 1;
                $scope.container = NormalResource.query({
                    page: pageNo,
                    perPage: 10
                });
            };

            $scope.pageChanged = function () {
                var pageNo = $scope.container.page;
                $scope.container = NormalResource.query({
                    page: pageNo,
                    perPage: 10
                });
            };

            $scope.$on('resourceRemoved', function (event, response) {
                var pageNo = $scope.container.page;
                $scope.container = NormalResource.query({
                    page: pageNo,
                    perPage: 10
                });
            });

            $scope.publishTempFile = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'publisher.modal.client.view.html',
                    controller: 'PublisherModalController',
                    resolve: {
                        fileToBePublished: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (fileRet) {
                }, function () {
                });
            };
        }
    ]);
