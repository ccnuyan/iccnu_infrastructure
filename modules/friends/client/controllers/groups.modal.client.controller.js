'use strict';

angular.module('friends').controller('GroupsModalController',
    ['$scope', '$modalInstance', 'objectToBeManipulated', 'groupsChecked', 'toastr', 'Group',
        function ($scope, $modalInstance, objectToBeManipulated, groupsChecked, toastr, Group) {

            $scope.thisObject = angular.copy(objectToBeManipulated);

            $scope.container = {};

            $scope.initGroups = function () {
                Group.get(function (data) {
                    data.groups.forEach(function (group) {
                        groupsChecked.forEach(function (gp) {
                            group.isChecked = group.isChecked || (group._id === gp) || (group._id === gp._id);
                        });
                    });
                    $scope.container = data;
                });
            };

            $scope.ok = function () {

                var groups = [];

                $scope.container.groups.forEach(function (group) {
                    if (group.isChecked) {
                        groups.push(group._id);
                    }
                });

                $modalInstance.close(groups);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ]);
