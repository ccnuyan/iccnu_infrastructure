'use strict';

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var tokenService = require('../../services/token.server.service.js');

var Client = require('mongoose').model('Client');
var User = require('mongoose').model('User');

var bearerStrategy = new BearerStrategy(
    function (accessToken, done) {
        var payload = tokenService.decode(accessToken);

        User.findOne({_id: payload.sub}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user, {scope: payload.scope});
        });
    });

var clientBasicStrategy = new BasicStrategy(
    function (username, password, callback) {
        Client.findOne({id: username}, function (err, client) {
            if (err) {
                return callback(err);
            }

            // No client found with that id or bad password
            if (!client) {
                return callback(null, false);
            }

            client.verifySecret(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }
                if (!isMatch) {
                    return callback(null, false);
                }
                // Success
                return callback(null, client);

            });
        });
    });

var clientPasswordStrategy = new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        console.log({id: clientId});
        Client.findOne({id: clientId}, function (err, client) {
            if (err) {
                return done(err);
            }

            // No client found with that id or bad password
            if (!client) {
                return done(null, false);
            }

            client.verifySecret(clientSecret, function (err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                // Success
                return done(null, client);

            });
        });
    }
);

module.exports = function (config) {
    passport.use('client-basic', clientBasicStrategy);

    passport.use('client-password', clientPasswordStrategy);

    passport.use('client-bearer', bearerStrategy);
};

