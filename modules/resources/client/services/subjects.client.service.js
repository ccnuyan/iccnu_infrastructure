'use strict';

angular.module('resources').factory('Subjects',
    function () {

        var subjects = [{
            key: 'all',
            name: '所有学科',
            active: 'active'
        }, {
            key: 'zhongxue_yuwen',
            name: '中学语文'
        }, {
            key: 'zhongxue_shuxue',
            name: '中学数学'
        }, {
            key: 'zhongxue_yingyu',
            name: '中学英语'
        }, {
            key: 'zhongxue_dili',
            name: '中学地理'
        },{
            key: 'zhongxue_wuli',
            name: '中学物理'
        }, {
            key: 'zhongxue_huaxue',
            name: '中学化学'
        }, {
            key: 'zhongxue_shengwu',
            name: '中学生物'
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
