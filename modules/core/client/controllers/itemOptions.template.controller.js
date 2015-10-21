'use strict';

angular.module('template').directive('itemOptions', function () {
    return {
        templateUrl: '/modules/core/views/itemOptions.template.client.view.html',
        restrict: 'E',
        scope: {
            flagEdit: '=flagEdit',
            parentEdit: '&optEdit',
            editTitle: '@editTitle',

            flagMove: '=flagMove',
            parentMove: '&optMove',
            moveTitle: '@moveTitle',

            flagShareFriend: '=flagShareFriend',
            parentShareFriend: '&optShareFriend',
            shareFriendTitle: '@shareFriendTitle',

            flagShareGroup: '=flagShareGroup',
            parentShareGroup: '&optShareGroup',
            shareGroupTitle: '@shareGroupTitle',

            flagPublish: '=flagPublish',
            parentPublish: '&optPublish',
            publishTitle: '@publishTitle',

            flagDelete: '=flagDelete',
            parentDelete: '&optDelete',
            deleteTitle: '@deleteTitle',

            flagApprove: '=flagApprove',
            parentApprove: '&optApprove',
            approveTitle: '@approveTitle',

            flagReject: '=flagReject',
            parentReject: '&optReject',
            rejectTitle: '@rejectTitle'
        },
        controller: function ($scope) {
            if ($scope.flagEdit)
                $scope.onEdit = function () {
                    $scope.parentEdit();
                };

            if ($scope.flagMove)
                $scope.onMove = function () {
                    $scope.parentMove();
                };

            if ($scope.flagShareFriend)
                $scope.onShareFriend = function () {
                    $scope.parentShareFriend();
                };

            if ($scope.flagShareGroup)
                $scope.onShareGroup = function () {
                    $scope.parentShareGroup();
                };

            if ($scope.flagPublish)
                $scope.onPublish = function () {
                    $scope.parentPublish();
                };

            if ($scope.flagDelete)
                $scope.onDelete = function () {
                    $scope.parentDelete();
                };

            if ($scope.flagApprove)
                $scope.onApprove = function () {
                    $scope.parentApprove();
                };

            if ($scope.flagReject)
                $scope.onReject = function () {
                    $scope.parentReject();
                };
        }
    };
});
