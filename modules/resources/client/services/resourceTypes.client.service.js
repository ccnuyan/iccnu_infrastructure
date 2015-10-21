'use strict';

angular.module('resources').factory('ResourceTypes',
    function () {

        var types = [{
            key: 'media_material',
            name: '媒体素材'
        }, {
            key: 'item_bank',
            name: '题库'
        }, {
            key: 'courseware',
            name: '课件'
        }, {
            key: 'case',
            name: '案例'
        }, {
            key: 'literature',
            name: '文献资料'
        }, {
            key: 'network_course',
            name: '网络课程'
        }, {
            key: 'frequently_asked_questions',
            name: '常见问题解答'
        }, {
            key: 'resource_index',
            name: '资源目录索引'
        }];

        var getTypeName = function (key) {
            var name;
            types.forEach(function (type) {
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
            types: types,
            getTypeName: getTypeName
        };
    }
);
