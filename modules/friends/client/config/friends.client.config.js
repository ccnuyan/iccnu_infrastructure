'use strict';

// Configuring the resources module
angular.module('friends').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: '分享',
            state: 'friends',
            type: 'dropdown'
        });

        Menus.addSubMenuItem('topbar', 'friends', {
            title: '我的好友',
            state: 'friends.list'
        });

        Menus.addSubMenuItem('topbar', 'friends', {
            title: '好友分组',
            state: 'groups.list'
        });
    }
]);
