'use strict';

angular.module('resources').factory('ResourceMetaTypes',
    function () {

        var types = [{
            key: 'file',
            name: '实体文件'
        }, {
            key: 'link',
            name: '网络链接'
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
