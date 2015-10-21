'use strict';

angular.module('friends').controller('GroupController',
    ['$scope', '$state', '$stateParams', '$location', '$resource', '$modal', 'Authentication', 'Group', 'File', 'FriendInfo', 'toastr',
        function ($scope, $state, $stateParams, $location, $resource, $modal, Authentication, Group, File, FriendInfo, toastr) {

            $scope.user = Authentication.user;

            $scope.find = function () {
                $scope.container = Group.get({groupId: $stateParams.group});
            };

            $scope.addFriend = function (group) {

                group.modalHeader = '设置组成员';
                group.modalLegend = '设置组“' + group.name + '”的成员';

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'friends.modal.client.view.html',
                    controller: 'FriendsModalController',
                    resolve: {
                        objectToBeManipulated: function () {
                            return group;
                        },
                        friendsChecked: function () {
                            return group.members;
                        }
                    }
                });

                modalInstance.result.then(function (friends) {

                    var obj = new Group({
                        _id: group._id,
                        name: group.name,
                        members: friends,
                        subFiles: group.subFiles
                    });

                    var successCallback = function (response) {
                        toastr.success('组成员设置完成');
                        group.members = response.members;
                    };

                    var errorCallback = function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        toastr.warning(errorResponse.data.message, '失败');
                    };

                    obj.$update(successCallback, errorCallback);

                }, function () {
                });
            };
        }
    ]);
