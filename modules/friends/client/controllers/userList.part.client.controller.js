'use strict';

angular.module('friends').directive('userList', ['Friend', 'toastr', '$state', function (Friend, toastr, $state) {
    return {
        templateUrl: '/modules/friends/views/userList.part.client.view.html',
        restrict: 'E',
        scope: {
            searchOn: '=searchOn',
            nullWarning: '=nullWarning',
            users: '=users',
            userListType: '=userListType'
        },
        controller: function ($scope) {

            $scope.isFriendList = $scope.userListType === 'friend-list';
            $scope.isSubmissionList = $scope.userListType === 'submission-list';
            $scope.isReadOnly = $scope.userListType === 'read-only';
            $scope.isTarget = $scope.userListType === 'target';

            if ($scope.userListType === 'friend-list') {
                $scope.delete = function (user) {
                    var friendObj = new Friend(user);
                    friendObj.$remove(function () {
                        toastr.success('删除好友成功');
                        $scope.$emit('usersShouldUpdateEvent');
                    }, function () {
                        toastr.warning('删除好友时发生了错误');
                    });
                };
            }

            if ($scope.userListType === 'submission-list') {

                $scope.approve = function (user) {
                    Friend.decide({_id: user._id, decision: 'approve'},
                        function (res) {
                            toastr.success('你们已经成功成为好友');
                            $scope.$emit('usersShouldUpdateEvent');
                        }, function () {
                            toastr.warning('处理好友申请时发生了错误');
                        });
                };

                $scope.reject = function (user) {
                    Friend.decide({_id: user._id, decision: 'reject'},
                        function (res) {
                            toastr.success('处理好友申请成功');
                            $scope.$emit('usersShouldUpdateEvent');
                        }, function () {
                            toastr.warning('处理好友申请时发生了错误');
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
        }
    };
}]);
