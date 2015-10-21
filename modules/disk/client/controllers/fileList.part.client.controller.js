'use strict';

angular.module('disk').directive('fileList', ['File', 'toastr', '$state', '$modal', '$http', function (File, toastr, $state, $modal, $http) {
    return {
        templateUrl: '/modules/disk/views/fileList.part.client.view.html',
        restrict: 'E',
        scope: {
            searchOn: '=searchOn',
            nullWarning: '=nullWarning',
            files: '=files',
            fileListType: '=fileListType'
        },
        controller: function ($scope) {

            $scope.isEditable = $scope.fileListType === 'directory-file-list';

            $scope.isReadOnly = $scope.fileListType === 'shared-file-list';

            if ($scope.isEditable) {

                $scope.delete = function (item) {
                    var itemToDelete = new File(item);
                    itemToDelete.$remove(function (response) {
                        toastr.success('“' + response.name + '”删除成功！');
                        $scope.$emit('fileRemovedEvent', {reqObj: item, resObj: response});
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '删除文件时发生了错误');
                    });
                };

                $scope.edit = function (item) {
                    item.itemToEdit = angular.copy(item);
                    item.isEditing = true;
                };

                $scope.confirm = function (item) {
                    var file = item;
                    file.isEditing = false;
                    var fileRes = new File(file.itemToEdit);

                    fileRes.$update(function (response) {
                        file.name = response.name;
                        toastr.success('“' + response.name + '”更新成功！');
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '更新失败');
                    });
                };

                $scope.shareFriend = function (file) {

                    file.modalHeader = '设置网盘文件共享';
                    file.modalLegend = '你要把网盘文件“' + file.name + '”共享给哪些好友？';

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'friends.modal.client.view.html',
                        controller: 'FriendsModalController',
                        resolve: {
                            objectToBeManipulated: function () {
                                return file;
                            },
                            friendsChecked: function () {
                                return file.sharedUsers;
                            }
                        }
                    });

                    modalInstance.result.then(function (friends) {

                        var obj = new File(file);

                        obj.sharedUsers = friends;

                        var successCallback = function (response) {
                            toastr.success('分享设置完成');
                            file.sharedUsers = response.sharedUsers;
                        };

                        var errorCallback = function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                            toastr.warning(errorResponse.data.message, '分享设置失败');
                        };

                        obj.$update(successCallback, errorCallback);

                    }, function () {
                    });
                };

                $scope.groupShare = function (file) {

                    file.modalHeader = '设置网盘文件共享';
                    file.modalLegend = '你要把网盘文件“' + file.name + '”共享给哪些组？';

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'groups.modal.client.view.html',
                        controller: 'GroupsModalController',
                        resolve: {
                            objectToBeManipulated: function () {
                                return file;
                            },
                            groupsChecked: function () {
                                return file.sharedGroups;
                            }
                        }
                    });

                    modalInstance.result.then(function (groups) {

                        var obj = new File(file);

                        obj.sharedGroups = groups;

                        var successCallback = function (response) {
                            toastr.success('分享设置完成');
                            file.sharedGroups = response.sharedGroups;
                        };

                        var errorCallback = function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                            toastr.warning(errorResponse.data.message, '分享设置失败');
                        };

                        obj.$update(successCallback, errorCallback);

                    }, function () {
                    });
                };

                $scope.publish = function (file) {

                    $scope.fileToBePublished = file;

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'publisher.modal.client.view.html',
                        controller: 'PublisherModalController',
                        resolve: {
                            fileToBePublished: function () {
                                return $scope.fileToBePublished;
                            }
                        }
                    });

                    modalInstance.result.then(function (fileRet) {
                    }, function () {
                    });
                };

                $scope.cancel = function (item) {
                    item.isEditing = false;
                };

                $scope.move = function (file) {

                    file.modalHeader = '移动文件';
                    file.modalLegend = '你要把文件' + file.name + '移动到哪里？';

                    $scope.objectToBeManipulated = file;

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'directories.modal.client.view.html',
                        controller: 'DirectoriesModalController',
                        resolve: {
                            objectToBeManipulated: function () {
                                return $scope.objectToBeManipulated;
                            }
                        }
                    });

                    modalInstance.result.then(function (directory) {
                        $http.put('/api/move/' + file.parent + '/' + directory._id + '/' + file._id, null)
                            .then(function (response, err) {
                                if (err) {
                                    toastr.warning('移动文件“' + file.name + '”时发生了错误。');
                                } else {
                                    toastr.success('文件“' + file.name + '”已经移动至：“' + directory.name + '”目录.');
                                    $scope.$emit('fileMoveCompleted', response);
                                }
                            });
                    }, function () {
                    });
                };
            }

            $scope.onClick = function (friend) {
                if (!$scope.isTarget) {
                    $state.go('friends.share', {friend: friend._id});
                } else {
                    friend.isChecked = !friend.isChecked;
                }
                //ui-sref="friends.share({friend:friend._id})"
            };

            $scope.getDownloadUrl = function (file) {
                if ($scope.fileListType === 'directory-file-list') {
                    return '/api/diskDownload/' + file.parent + '/' + file._id;
                }

                if ($scope.fileListType === 'shared-file-list') {
                    return '/api/shareDownload/' + file._id;
                }

                return '/server-error';
            };
        }
    };
}]);
