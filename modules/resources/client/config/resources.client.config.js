'use strict';

// Configuring the resources module
angular.module('resources').run(['Menus',
    function (Menus) {
        //Menus.addMenuItem('topbar', {
        //    title: '资源搜索',
        //    state: 'resources.search',
        //    roles: ['guest', 'user']
        //});
        Menus.addMenuItem('topbar', {
            title: '资源',
            state: 'resources',
            type: 'dropdown'
        });

        Menus.addSubMenuItem('topbar', 'resources', {
            title: '我的资源',
            state: 'resources.mine'
        });

        Menus.addSubMenuItem('topbar', 'resources', {
            title: '资源搜索',
            state: 'resources.search'
        });

        Menus.addSubMenuItem('topbar', 'resources', {
            title: '资源审核',
            state: 'resources.review',
            roles: ['rsadmin']
        });

        Menus.addSubMenuItem('topbar', 'resources', {
            title: '资源批量添加',
            state: 'resources.importer',
            roles: ['rsadmin']
        });
    }
]);
