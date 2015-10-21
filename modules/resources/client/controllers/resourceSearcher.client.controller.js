'use strict';

angular.module('resources').controller('ResourceSearcherController',
    ['$scope', '$http', 'ResourceTypes', 'Subjects', 'toastr',
        function ($scope, $http, ResourceTypes, Subjects, toastr) {

            $scope.res_meta_types = ResourceTypes.types;
            $scope.subjects = Subjects.subjects;

            $scope.init = function () {
                $http.get('/api/resourcesSiteInfo').then(function (ret) {
                    $scope.resourcesSiteInfo = ret.data;
                });
            };

            $scope.searchKnowledgeNode = function () {

                var searchQuery = '';

                if ($scope.selectedSubject && $scope.selectedSubject.key !== 'all') {
                    searchQuery += '&subject=' + $scope.selectedSubject.key;
                }

                $http.get('/api/knowledgeNodeSearch?term=' + $scope.searchTerm + searchQuery).then(function (ret) {
                    $scope.knowledgeNodes = ret.data;
                });
            };

            $scope.search = function () {

                if (!$scope.searchTerm) {
                    toastr.warning('需要输入搜索条目');
                    return;
                }

                $scope.searched = true;
                $scope.justSearchedTerm = $scope.searchTerm;

                var searchQuery = '';

                if ($scope.selectedResourceType) {
                    searchQuery += '&resourceType=' + $scope.selectedResourceType.key;
                }
                if ($scope.selectedSubject && $scope.selectedSubject.key !== 'all') {
                    searchQuery += '&subject=' + $scope.selectedSubject.key;
                }
                if ($scope.selectedKnowledgeNode) {
                    searchQuery += '&knowledgeNode=' + $scope.selectedKnowledgeNode._id;
                }

                var pageNo = 1;

                $http.get('/api/resourceSearch?term=' + $scope.searchTerm + '&page=' + pageNo + searchQuery).then(function (ret) {
                    $scope.container = ret.data;
                });
            };

            $scope.selectResourceType = function (resType) {
                $scope.selectedResourceType = resType;
                $scope.search();
            };

            $scope.selectSubject = function (subject) {
                $scope.knowledgeNodes = [];
                $scope.selectedKnowledgeNode = null;
                $scope.subjects.forEach(function (subj) {
                    subj.active = '';
                });
                subject.active = 'active';
                $scope.selectedSubject = subject;

                if ($scope.searchTerm) {
                    $scope.search();
                }
            };

            $scope.selectKnowledgeNode = function (node) {
                $scope.selectedKnowledgeNode = node;
                $scope.search();
            };


            $scope.unSelectResourceType = function () {
                $scope.selectedResourceType = null;
                $scope.search();
            };

            $scope.unSelectSubject = function () {
                $scope.selectedSubject = null;
                $scope.search();
            };

            $scope.unSelectKnowledgeNode = function () {
                $scope.selectedKnowledgeNode = null;
                $scope.search();
            };

            $scope.pageChanged = function () {
                var pageNo = $scope.container.page;

                $http.get('/api/resourceSearch?term=' + $scope.searchTerm + '&page=' + pageNo).then(function (ret) {
                    $scope.container = ret.data;
                });
            };
        }
    ]);
