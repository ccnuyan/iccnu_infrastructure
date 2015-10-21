'use strict';

// Configuring the resources module
angular.module('disk').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: '我的网盘',
            state: 'disk.directory',
            roles: ['user']
        });
    }
]);
