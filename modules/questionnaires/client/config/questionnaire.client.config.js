'use strict';

// Configuring the Chat module
angular.module('questionnaire').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', {
            title: '问卷',
            state: 'questionnaires.list'
        });
    }
]);
