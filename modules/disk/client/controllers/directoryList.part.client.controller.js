'use strict';

angular.module('disk').directive('directoryList', ['Directory', 'toastr', '$state', '$modal', function (Directory, toastr, $state, $modal) {
    return {
        templateUrl: '/modules/disk/views/directoryList.part.client.view.html',
        restrict: 'E',
        scope: {
            searchOn: '=searchOn',
            nullWarning: '=nullWarning',
            directory: '=parentDirectory',
            directories: '=directories',
            directoryListType: '=directoryListType',
            selectedDirectory: '=selectedDirectory',
            showParent: '=showParent'
        },
        controller: function ($scope) {

            $scope.isEditable = $scope.directoryListType === 'editable';
            $scope.isReadOnly = $scope.directoryListType === 'read-only';
            $scope.isTarget = $scope.directoryListType === 'target';
            $scope.isParentVisible = $scope.showParent && $scope.directory !== null;

            if ($scope.isEditable) {
                $scope.delete = function (item) {
                    var itemToDelete = new Directory(item);
                    itemToDelete.$remove(function (response) {
                        toastr.success('“' + response.name + '”删除成功！');
                        $scope.$emit('directoryRemovedEvent', response);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '删除目录时发生了错误');
                    });
                };

                $scope.edit = function (item) {
                    item.itemToEdit = angular.copy(item);
                    item.isEditing = true;
                };

                $scope.confirm = function (item) {
                    var directory = item;
                    directory.isEditing = false;
                    var dirRes = new Directory(directory.itemToEdit);

                    dirRes.$update(function (response) {
                        directory.name = response.name;
                        toastr.success('“' + response.name + '”更新成功！');
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '更新失败');
                    });
                };

                $scope.cancel = function (directory) {
                    directory.isEditing = false;
                };
            }

            $scope.onClick = function (directory) {
                if (!$scope.isTarget) {
                    $state.go('disk.directory', {directory: directory._id});
                    //ui-sref="disk.directory({directory:directory._id})"
                } else {
                    $scope.$emit('targetDirectorySelected', directory);
                }
            };


            $scope.onCheck = function (directory) {
                $scope.selectedDirectory._id = directory._id;
            };
        }
    };
}]);
