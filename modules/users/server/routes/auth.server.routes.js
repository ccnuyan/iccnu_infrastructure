'use strict';

var OAuth2Strategy = require('passport-oauth2').Strategy;
var path = require('path');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');
var User = mongoose.model('User');
var protocol = config.port === 443 ? require('https') : require('http');
var oauth2Policy = require('../policies/oauth2.server.policy');
var users = require('../controllers/users.server.controller');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Auth API
 *
 * @module Users
 * @main auth routes
 * @class auth.server.routes
 */
var passport = require('passport');

module.exports = function (app) {

    // User Routes

    var users = require('../controllers/users.server.controller');

    app.route('/api/auth/signout').get(users.signout);

    app.route('/api/token').post(passport.authenticate(['client-basic', 'client-password'], {session: false}), users.token);

    app.route('/api/oauth2/me').all(oauth2Policy.isAllowed).get(users.me);

    app.route('/auth/iccnu').get(passport.authenticate('oauth2'));

    app.route('/auth/iccnu/login').get(passport.authenticate('oauth2',
        {
            failureRedirect: '/server-error',
            successRedirect: '/'
        }));

    passport.use(new OAuth2Strategy(config.lrs_oauth_config,
        function (accessToken, refreshToken, profile, done) {

            var options = config.lrs_user_info_options;

            options.headers = {
                Authorization: 'Bearer ' + accessToken
            };

            var req = protocol.request(options, function (res) {

                var body = '';
                res.on('data', function (d) {
                    body += d;
                });

                res.on('end', function () {

                    if (res.statusCode !== 200) {
                        console.log(body);
                        done({message: 'Unauthorized'});
                    }

                    var parsedUser = JSON.parse(body);

                    User.findOne({
                        username: parsedUser.username
                    }, function (err, user) {

                        if (err) {
                            done({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }

                        if (user) {
                            user.email = parsedUser.email;
                            user.username = parsedUser.username;
                            user.provider = 'iccnu';
                            user.providerData = {
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            };
                            user.save(function (err, newUser) {
                                done(null, newUser);
                            });
                        } else {
                            var newUser = new User({
                                email: parsedUser.email,
                                username: parsedUser.username,
                                provider: 'iccnu',
                                providerData: {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken
                                }
                            });
                            newUser.save(function (err, newUser) {
                                done(null, newUser);
                            });
                        }
                    });
                });
            });

            req.on('error', function (e) {
                done(e.message);
            });

            req.end();
        }
    ));
};
