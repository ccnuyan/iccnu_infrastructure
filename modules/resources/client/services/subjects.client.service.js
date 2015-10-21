'use strict';

angular.module('resources').factory('Subjects',
    function () {

        var subjects = [{
            key: 'all',
            name: '所有学科',
            active: 'active'
        }, {
            key: 'cjsk',
            name: '初中语文'
        }, {
            key: 'mjsk',
            name: '初中数学'
        }, {
            key: 'ejsk',
            name: '初中英语'
        }, {
            key: 'pjsk',
            name: '初中物理'
        }, {
            key: 'pjck',
            name: '初中化学'
        }];

        var getSubjectName = function (key) {
            var name;
            subjects.forEach(function (type) {
                if (type.key === key) {
                    name = type.name;
                }
            });
            if (!name) {
                name = '未提供';
            }

            return name;
        };

        return {
            subjects: subjects,
            getSubjectName: getSubjectName
        };
    }
);
