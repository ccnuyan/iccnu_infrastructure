'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var config = require(path.resolve('./config/config'));
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Directory = mongoose.model('Directory');
var AccessToken = mongoose.model('AccessToken');
var tokenService = require('../../services/token.server.service.js');
var protocol = config.port === 443 ? require('https') : require('http');
var AuthorizationCode = mongoose.model('AuthorizationCode');

exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.oauth2signout = function (req, res) {
    req.logout();
    res.redirect('/oauth2/signin?&response_type=code&state=' + req.query.state + '&client_id=' +
        req.query.client_id + '&redirect_uri=' + req.query.redirect_uri
    );
};

exports.token = function (req, res, next) {

    /*获取infrastructure token的方式

     1 使用lrs的token获取
     其中lrs_token 放在 header里

     适用于bs/cs
     */
    if (req.headers.lrs_token !== null) {

        var lrs_token = req.headers.lrs_token;

        var options = config.lrs_user_info_options;
        options.headers = {
            'Authorization': 'Bearer ' + lrs_token
        };

        var tkReq = protocol.request(options, function (tkRes) {

            var body = '';
            tkRes.on('data', function (d) {
                body += d;
            });
            tkRes.on('end', function () {

                // Data reception is done, do whatever with it!
                var parsedUser = JSON.parse(body);

                var tkCallback = function (newuser) {
                    var at = new AccessToken();

                    at.userId = newuser._id;
                    at.clientId = req.user._id;
                    at.token = tokenService.createAccessToken(at.userId, at.clientId, at.scope);

                    at.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        var ret = {
                            access_token: at.token,
                            token_type: 'Bearer'
                        };

                        return res.json(ret);
                    });
                };

                User.findOne({
                    username: parsedUser.username
                }, function (err, user) {

                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }

                    if (user) {
                        user.email = parsedUser.email;
                        user.username = parsedUser.username;
                        user.provider = 'iccnu';
                        user.providerData = {
                            accessToken: lrs_token
                        };
                        user.save(function (err, newUser) {
                            tkCallback(newUser);
                        });
                    } else {
                        var newUser = new User({
                            email: parsedUser.email,
                            username: parsedUser.username,
                            provider: 'iccnu',
                            providerData: {
                                accessToken: lrs_token
                            }
                        });
                        newUser.save(function (err, newUser) {
                            tkCallback(newUser);
                        });
                    }
                });
            });
        });

        tkReq.on('error', function (e) {
            next(e.message);
        });

        tkReq.end();
    }
    else {
        next({message: 'no lrs_token field in headers'});
    }
};

exports.me = function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user) {
        if (err) {
            return next({message: 'user specified does not exist'});
        } else {
            return res.json(user.toGetMeStruct());
        }
    });
};