'use strict';

angular.module('disk').controller('MyDiskController',
    ['$scope', '$stateParams', '$location', '$resource', '$modal', 'Authentication', 'Directory', 'File', 'FileUploader', '$state', 'toastr', '$http',
        function ($scope, $stateParams, $location, $resource, $modal, Authentication, Directory, File, FileUploader, $state, toastr, $http) {

            $scope.authentication = Authentication;

            if (!$scope.authentication.user) {
                return $state.go('home');
            }

            var uploader = $scope.uploader = new FileUploader();

            $scope.container = {};

            $scope.operationCheckModel = {
                createFolder: false,
                uploadFile: false
            };

            var directory = $stateParams.directory ? $stateParams.directory : $scope.authentication.user.rootDirectory;

            $scope.uploader.onAfterAddingAll = function (items) {
                items.forEach(function (item) {
                    item.url = '/api/tempUpload/';
                    item.parent = $scope.current._id;
                });
            };

            $scope.$on('directoryRemovedEvent', function (event, response) {
                if (response.parent === $scope.current._id) {
                    for (var j in $scope.current.subDirectories) {
                        if ($scope.current.subDirectories[j]._id === response._id) {
                            $scope.current.subDirectories.splice(j, 1);
                        }
                    }
                }
            });

            $scope.$on('fileRemovedEvent', function (event, response) {
                if (response.reqObj.parent === $scope.current._id) {
                    for (var i in $scope.current.subFiles) {
                        if ($scope.current.subFiles[i]._id === response.resObj._id) {
                            $scope.current.subFiles.splice(i, 1);
                        }
                    }
                }
            });

            $scope.$on('fileMoveCompleted', function (event, response) {
                if (response.data.source._id === $scope.current._id) {
                    for (var i in $scope.current.subFiles) {
                        if ($scope.current.subFiles[i]._id === response.data.file._id) {
                            $scope.current.subFiles.splice(i, 1);
                        }
                    }

                    for (var j in $scope.current.subDirectories) {
                        if ($scope.current.subDirectories[j]._id === response.data.target._id) {
                            $scope.current.subDirectories[j].subFiles.push(response.data.file._id);
                        }
                    }
                }
                if (response.data.target._id === $scope.current._id) {
                    response.data.file.parent = $scope.current._id;
                    $scope.current.subFiles.push(response.data.file);

                    for (var x in $scope.current.subDirectories) {
                        if ($scope.current.subDirectories[x]._id === response.data.source._id) {
                            var index = $scope.current.subDirectories[x].subFiles.indexOf(response.data.file._id);
                            $scope.current.subDirectories[x].subFiles.splice(index, 1);
                        }
                    }
                }
            });

            $scope.create = function (directoryName) {
                if ($scope.current.depth >= 2) {
                    toastr.warning('不允许创建更深层次的目录');
                    return;
                }

                var directory = new Directory({
                    name: directoryName
                });

                var successCallback = function (response) {
                    $scope.current.subDirectories.push(response);
                    $scope.name = '';
                    toastr.success('目录“' + response.name + '”创建成功！');
                };

                var errorCallback = function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                    toastr.warning(errorResponse.data.message, '目录创建失败');
                };

                directory.$save({directoryId: $scope.current._id}, successCallback, errorCallback);
            };

            $scope.upward = function () {
                $scope.find($scope.current.parent);
            };

            $scope.init = function () {
                $scope.find(directory);
            };

            $scope.find = function (directory) {
                if ($scope.current && $scope.current.subDirectories)$scope.current.subDirectories = [];
                if ($scope.current && $scope.current.subFiles)$scope.current.subFiles = [];

                Directory.query({directoryId: directory}, function (data) {
                    $scope.current = data;
                    if ($scope.current.subFiles) {
                        $scope.current.subFiles.forEach(function (subfile) {
                            subfile.parent = $scope.current._id;
                        });
                    }
                });
            };

            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                var tempFileId = response._id;

                $http.post('/api/diskAdd/' + fileItem.parent + '/' + tempFileId)
                    .then(function (response) {
                        File.get({fileId: response.data._id, parent: fileItem.parent}, function (data) {
                            var file = data;
                            data.parent = fileItem.parent;
                            toastr.success(fileItem.file.name, '上传成功');
                            $scope.current.subFiles.push(file);
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                            toastr.warning(errorResponse.data.message, '上传失败');
                        });
                    });
            };
        }
    ]);
