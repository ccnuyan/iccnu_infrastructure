'use strict';

angular.module('resources').directive('resourceList', ['$http', 'toastr', 'ResourceTypes', 'ResAdminResource', 'NormalResource',
    function ($http, toastr, ResourceTypes, ResAdminResource, NormalResource) {
        return {
            templateUrl: '/modules/resources/views/resourceList.part.client.view.html',
            restrict: 'E',
            scope: {
                resources: '=resources',
                searchOn: '=searchOn',
                nullWarning: '=nullWarning',
                resourceListType: '=resourceListType'
            },
            controller: function ($scope) {

                if ($scope.resourceListType === 'searcher-result') {
                    $scope.statisticOn = true;
                }

                if ($scope.resourceListType === 'imported-resource-list') {
                    $scope.flagOn = true;
                }

                if ($scope.resourceListType === 'my-resource-list') {

                    $scope.isStatusOn = true;
                    $scope.isFooterVisible = true;

                    var successDeleteCallback = function (response) {
                        toastr.success('成功！');

                        $scope.$emit('resourceRemoved', response);
                    };

                    var errorDeleteCallback = function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '失败！');
                    };

                    $scope.delete = function (resource) {
                        var resObj = new NormalResource(resource);
                        resObj.$remove(successDeleteCallback, errorDeleteCallback);
                    };
                }

                if ($scope.resourceListType === 'rsadmin-resource-list') {
                    $scope.isFooterVisible = true;

                    var successDecideCallback = function (response) {
                        toastr.success('成功！');

                        $scope.$emit('resourceDecided', response);
                    };

                    var errorDecideCallback = function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '失败！');
                    };

                    $scope.approve = function (resource) {

                        var resObj = new ResAdminResource({
                            status: 'approved',
                            description: resource.description
                        });

                        resObj.$save({resourceId: resource._id}, successDecideCallback, errorDecideCallback);
                    };

                    $scope.reject = function (resource) {

                        var resObj = new ResAdminResource({
                            status: 'rejected',
                            description: resource.description
                        });

                        resObj.$save({resourceId: resource._id}, successDecideCallback, errorDecideCallback);
                    };
                }

                $scope.onClick = function (resource) {
                    resource.res_type_display = ResourceTypes.getTypeName(resource.res_type);

                    if ($scope.selectedResourceId !== resource._id) {
                        $scope.selectedResourceId = resource._id;
                    } else {
                        $scope.selectedResourceId = null;
                    }
                };

                $scope.downloadHit = function (resource) {
                    $http.post('/api/resourcesHit/' + resource._id, null)
                        .then(function (response, err) {
                            if (!err) {
                                resource.downloads = response.data.downloads;
                            }
                        });
                };
            }
        };
    }]);
