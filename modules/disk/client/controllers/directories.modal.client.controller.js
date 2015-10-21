'use strict';

angular.module('disk').controller('DirectoriesModalController',
    ['$scope', '$modalInstance', 'objectToBeManipulated', 'Authentication', 'Directory', 'toastr',
        function ($scope, $modalInstance, objectToBeManipulated, Authentication, Directory, toastr) {

            $scope.thisObject = angular.copy(objectToBeManipulated);

            $scope.container = {};

            $scope.selectedDirectory = {_id: 0};

            var directory = Authentication.user.rootDirectory;

            $scope.find = function (directory) {
                Directory.query({directoryId: directory}, function (data) {
                    $scope.current = data;
                });
            };

            $scope.$on('targetDirectorySelected', function (event, directory) {
                $scope.find(directory._id);
            });

            $scope.initDirectories = function () {
                $scope.find(directory);
            };

            $scope.ok = function () {

                var dir;

                $scope.current.subDirectories.forEach(function (directoryItem) {
                    if (directoryItem._id === $scope.selectedDirectory._id) {
                        dir = directoryItem;
                    }
                });

                if ($scope.current._id === $scope.selectedDirectory._id) {
                    dir = $scope.current;
                }

                if (dir) {
                    $modalInstance.close(dir);
                }
                else {
                    toastr.warning('你没有选择目标文件夹。');
                    return $modalInstance.dismiss('cancel');
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.upward = function () {
                $scope.find($scope.current.parent);
            };
        }
    ]);
