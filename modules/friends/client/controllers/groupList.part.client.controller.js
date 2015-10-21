'use strict';

angular.module('friends').directive('groupList', ['Group', 'toastr', '$state', function (Group, toastr, $state) {
    return {
        templateUrl: '/modules/friends/views/groupList.part.client.view.html',
        restrict: 'E',
        scope: {
            searchOn: '=searchOn',
            nullWarning: '=nullWarning',
            groups: '=groups',
            groupListType: '=groupListType'
        },
        controller: function ($scope) {

            $scope.isEditable = $scope.groupListType === 'editable';
            $scope.isTarget = $scope.groupListType === 'target';

            if ($scope.isEditable) {
                $scope.delete = function (group) {
                    var obj = new Group(group);
                    obj.$remove(function (groupRet) {
                        toastr.success('删除好友分组成功');
                        for (var i in $scope.groups) {
                            if ($scope.groups[i]._id === groupRet._id) {
                                $scope.groups.splice(i, 1);
                            }
                        }
                    }, function () {
                        toastr.warning('删除好友分组时发生了错误');
                    });
                };
            }

            $scope.edit = function (item) {
                item.itemToEdit = angular.copy(item);
                item.isEditing = true;
            };

            $scope.cancel = function (item) {
                item.isEditing = false;
            };

            $scope.confirm = function (item) {
                var obj = new Group({
                    _id: item._id,
                    name: item.itemToEdit.name
                });

                obj.$update(function (response) {
                    item.isEditing = false;
                    item.name = response.name;
                    toastr.success('成功！');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                    toastr.warning(errorResponse.data.message, '失败');
                });
            };

            $scope.onClick = function (group) {
                if (!$scope.isTarget) {
                    $state.go('groups.group', {group: group._id});
                } else {
                    group.isChecked = !group.isChecked;
                }
                //ui-sref="groups.group({group:group._id})"
            };
        }
    };
}]);
