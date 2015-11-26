'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    User = require('mongoose').model('User'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

module.exports = function (app, db) {

    // Serialize sessions 只有在Session访问时有效，token访问时无效
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize sessions 只有在Session访问时有效，token访问时无效
    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -password', function (err, user) {
            done(err, user);
        });
    });

    // Initialize strategies
    config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
        require(path.resolve(strategy))(config);
    });

    // Add passport's middleware
    app.use(passport.initialize());
    app.use(passport.session());
};
