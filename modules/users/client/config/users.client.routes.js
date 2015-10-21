'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('settings', {
                abstract: true,
                url: '/settings',
                templateUrl: 'modules/users/views/settings/settings.client.view.html'
            }).
            state('settings.profile', {
                url: '/profile',
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('settings.password', {
                url: '/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('settings.accounts', {
                url: '/accounts',
                templateUrl: 'modules/users/views/settings/manage-social-accounts.client.view.html'
            }).
            state('settings.picture', {
                url: '/picture',
                templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
            }).
            state('authentication', {
                abstract: true,
                url: '/authentication',
                templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
            }).
            state('authentication.signup', {
                url: '/signup',
                templateUrl: 'modules/users/views/authentication/signup.client.view.html'
            }).
            state('authentication.signin', {
                url: '/signin',
                templateUrl: 'modules/users/views/authentication/signin.client.view.html'
            }).
            //oauth2
            state('oauth2', {
                abstract: true,
                url: '/oauth2',
                templateUrl: 'modules/users/views/oauth2/oauth2.client.view.html'
            }).
            state('oauth2.signup', {
                url: '/signup?state&response_type&redirect_uri&client_id',
                templateUrl: 'modules/users/views/oauth2/signup.client.view.html'
            }).
            state('oauth2.signin', {
                url: '/signin?state&response_type&redirect_uri&client_id',
                templateUrl: 'modules/users/views/oauth2/signin.client.view.html'
            }).
            state('oauth2.authorize', {
                url: '/authorize?state&response_type&redirect_uri&client_id',
                templateUrl: 'modules/users/views/oauth2/authorize.client.view.html'
            }).
            state('password', {
                abstract: true,
                url: '/password',
                template: '<ui-view/>'
            }).
            state('password.forgot', {
                url: '/forgot',
                templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
            }).
            state('password.reset', {
                abstract: true,
                url: '/reset',
                template: '<ui-view/>'
            }).
            state('password.reset.invalid', {
                url: '/invalid',
                templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
            }).
            state('password.reset.success', {
                url: '/success',
                templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
            }).
            state('password.reset.form', {
                url: '/:token',
                templateUrl: 'modules/users/views/password/reset-password.client.view.html'
            });
    }
]);
