'use strict';

angular.module('resources').controller('RsAdminImporterController',
    ['$scope', '$http', 'ResAdminResource', 'FileUploader', 'toastr', 'Authentication', '$state',
        function ($scope, $http, ResAdminResource, FileUploader, toastr, Authentication, $state) {

            $scope.authentication = Authentication;

            if (!$scope.authentication.user) {
                return $state.go('home');
            }

            var uploader = $scope.uploader = new FileUploader();

            $scope.container = {};

            $scope.search = function () {
                $scope.searched = true;
                $scope.justSearchedTerm = $scope.searchTerm;
                $http.get('/api/knowledgeNodeSearch?term=' + $scope.searchTerm).then(function (ret) {
                    $scope.knowledgeNodes = ret.data;
                });
            };

            $scope.removeNode = function () {
                $scope.selectedNode = null;
            };

            $scope.selectNode = function (knode) {
                $scope.selectedNode = knode;
            };

            uploader.onAfterAddingAll = function (items) {
                uploader.queue.forEach(function (item) {
                    item.cancel();
                });
                uploader.queue = [items[0]];
                items[0].url = '/api/resourcesImport/' + ($scope.selectedNode ? ('?knowledgeNode=' + $scope.selectedNode._id) : '');
            };

            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                uploader.queue = [];
                $scope.resources = response;
            };

            uploader.onErrorItem = function (fileItem, response, status, heaers) {
                toastr.warning(response.message);
            };
        }
    ])
;
