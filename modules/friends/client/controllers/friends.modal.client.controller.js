'use strict';

angular.module('friends').controller('FriendsModalController',
    ['$scope', '$modalInstance', 'objectToBeManipulated', 'friendsChecked', 'toastr', 'Friend',
        function ($scope, $modalInstance, objectToBeManipulated, friendsChecked, toastr, Friend) {

            $scope.thisObject = angular.copy(objectToBeManipulated);

            $scope.container = {};

            $scope.initFriends = function () {
                Friend.get(function (data) {
                    data.friends.forEach(function (friend) {
                        friendsChecked.forEach(function (fd) {
                            friend.isChecked = friend.isChecked || (friend._id === fd) || (friend._id === fd._id);
                        });
                    });
                    $scope.container = data;
                });
            };

            $scope.ok = function () {

                var friends = [];

                $scope.container.friends.forEach(function (friend) {
                    if (friend.isChecked) {
                        friends.push(friend._id);
                    }
                });

                $modalInstance.close(friends);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ]);
