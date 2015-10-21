'use strict';

angular.module('resources').controller('PublisherModalController',
    ['$scope', '$http', '$modalInstance', 'fileToBePublished', 'NormalResource', 'toastr', 'KnowledgeNodes', 'ResourceTypes', 'ResourceByFile', 'ResourceMetaTypes', 'ResourceByTempFile', 'ResourceByLink', 'FileUploader',
        function ($scope, $http, $modalInstance, fileToBePublished, NormalResource, toastr, KnowledgeNodes, ResourceTypes, ResourceByFile, ResourceMetaTypes, ResourceByTempFile, ResourceByLink, FileUploader) {

            if (fileToBePublished) {
                $scope.file = angular.copy(fileToBePublished);
                $scope.resTitle = $scope.file.name;
                $scope.mode = 'diskFilePublisher';
                $scope.selectedMetaType = ResourceMetaTypes.types[0];
                $scope.uploader = new FileUploader();
            } else {
                $scope.mode = 'regularPublisher';
                $scope.res_meta_types = ResourceMetaTypes.types;
                var uploader = $scope.uploader = new FileUploader();

                uploader.onAfterAddingAll = function (items) {
                    uploader.queue.forEach(function (item) {
                        item.cancel();
                    });
                    uploader.queue = [items[0]];
                    items[0].url = '/api/tempUpload/';
                };

                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    $scope.file = response;
                    $scope.resTitle = response.name;
                };
            }

            var validateInput = function () {

                if ($scope.mode === 'regularPublisher') {
                    if (!$scope.selectedMetaType) {
                        toastr.warning('必须选择一种资源形式');
                        return false;
                    }

                    if ($scope.selectedMetaType && $scope.selectedMetaType.key === 'file') {
                        if (!$scope.file) {
                            toastr.warning('请先选择文件，并上传');
                            return false;
                        }
                    }
                }

                if (!$scope.resTitle) {
                    toastr.warning('你需要给要发布的资源起个名字。');
                    return false;
                }

                if (!$scope.resDescription) {
                    toastr.warning('你至少也要描述一下你发布的资源吧。');
                    return false;
                }

                if ($scope.selectedMetaType && $scope.selectedMetaType.key === 'link') {
                    if (!$scope.resUri) {
                        toastr.warning('你忘了指定网络链接的地址吧。');
                        return false;
                    }
                }

                return true;
            };

            $scope.res_types = ResourceTypes.types;

            $scope.search = function () {
                $scope.searched = true;
                $scope.justSearchedTerm = $scope.searchTerm;
                $http.get('/api/knowledgeNodeSearch?term=' + $scope.searchTerm).then(function (ret) {
                    $scope.knowledgeNodes = ret.data;
                });
            };

            $scope.ok = function () {

                if (!validateInput()) {
                    return;
                }

                var resObj = {
                    description: $scope.resDescription,
                    title: $scope.resTitle
                };

                if ($scope.resCoverage) {
                    resObj.coverage = $scope.resCoverage;
                }
                if ($scope.selectedNode) {
                    resObj.knowledgeNode = $scope.selectedNode._id;
                }
                if ($scope.selectedType) {
                    resObj.type = $scope.selectedType.key;
                }
                if ($scope.resUri) {
                    resObj.uri = $scope.resUri;
                }

                var resource = {};

                if ($scope.mode === 'diskFilePublisher') {
                    resource = new ResourceByFile(resObj);
                }

                if ($scope.mode === 'regularPublisher') {
                    if ($scope.selectedMetaType.key === 'file')
                        resource = new ResourceByTempFile(resObj);
                    if ($scope.selectedMetaType.key === 'link')
                        resource = new ResourceByLink(resObj);
                }

                var successCallback = function (response) {
                    toastr.success('提交成功，请等待资源通过审核。');
                    $modalInstance.close(response);
                };

                var errorCallback = function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                    toastr.warning(errorResponse.data.message, '失败');
                };

                if ($scope.mode === 'diskFilePublisher') {

                    resource.$save({fileId: $scope.file._id}, successCallback, errorCallback);
                }

                if ($scope.mode === 'regularPublisher') {
                    if ($scope.selectedMetaType.key === 'file') {
                        resource.$save({tempFileId: $scope.file._id}, successCallback, errorCallback);
                    }
                    if ($scope.selectedMetaType.key === 'link') {
                        resource.$save(null, successCallback, errorCallback);
                    }
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.removeNode = function () {
                $scope.selectedNode = null;
            };

            $scope.selectNode = function (knode) {
                $scope.selectedNode = knode;
            };

            $scope.removeType = function () {
                $scope.selectedType = null;
            };

            $scope.selectType = function (type) {
                $scope.selectedType = type;
            };

            $scope.selectMetaType = function (type) {
                $scope.selectedMetaType = type;
            };
        }
    ]);
