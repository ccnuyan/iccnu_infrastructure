'use strict';

/**
 * OAuth2 API
 *
 * @module Users
 * @main oauth2 routes
 * @class oauth2.server.routes
 */
var passport = require('passport');
var oauth2 = require('../controllers/users.server.controller');
var oauth2Policy = require('../policies/oauth2.server.policy');

module.exports = function (app) {

    var users = require('../controllers/users.server.controller');

    // Create endpoint handlers for oauth2 token
    app.route('/api/oauth2/token')
    /**
     * 供 Resource Owner Flow 获取Token
     * 供 Authorization Code Flow 获取Token
     * @method /api/oauth2/token POST
     * @return {Object} Access Token
     */
        .post(passport.authenticate(['client-basic', 'client-password'], {session: false}), users.token);

    // Create endpoint handlers for /user
    app.route('/api/oauth2/me').all(oauth2Policy.isAllowed)
    /**
     * 获取登陆用户信息
     * @method /api/oauth2/me GET
     * @return {User} 用户信息
     */
        .get(oauth2.me);

    app.route('/api/oauth2/signout')
        .get(users.oauth2signout);
};
