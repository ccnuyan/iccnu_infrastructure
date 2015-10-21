'use strict';

angular.module('questionnaire').controller('QrCodeModalController',
    ['$scope', '$modalInstance', '$location',
        function ($scope, $modalInstance, $location) {

            $scope.QrCodeText = $location.absUrl();

            $scope.ok = function () {
                $modalInstance.dismiss();
            };
        }
    ]);
