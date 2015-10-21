'use strict';

angular.module('friends').controller('MyFriendsController',
    ['$scope', '$state', '$stateParams', '$location', '$resource', '$modal', 'Authentication', 'Friend', 'File', 'FriendInfo', 'toastr',
        function ($scope, $state, $stateParams, $location, $resource, $modal, Authentication, Friend, File, FriendInfo, toastr) {

            $scope.authentication = Authentication;

            if (!$scope.authentication.user) {
                return $state.go('home');
            }

            $scope.user = Authentication.user;

            $scope.$on('usersShouldUpdateEvent', function (event, mass) {
                $scope.find();
            });

            $scope.find = function () {
                $scope.container = Friend.query();
            };

            $scope.findUser = function (username) {
                $scope.result = FriendInfo.query({username: username});
            };

            $scope.submitFriend = function (id) {
                Friend.submit({_id: id},
                    function (res) {
                        toastr.success('已对' + res.displayName + '发出好友请求，请等待对方通过。');
                    }, function (err) {
                        toastr.warning('申请对方为好友时发生了错误: ' + err.data.message);
                    });

            };
        }
    ]);
