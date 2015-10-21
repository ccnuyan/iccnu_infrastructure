'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');
var path = require('path');
var oauth2Service = require('../../../users/server/services/oauth2.server.service.js');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var mongoose = require('mongoose');
var Directory = mongoose.model('Directory');
var User = mongoose.model('User');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'rsadmin'],
        allows: []
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/tempUpload/',
            permissions: ['post']
        }]
    }, {
        roles: ['guest'],
        allows: []
    }]);
};

exports.isAllowed = function (req, res, callback) {
    var successCallback = function () {
        var roles = (req.user) ? req.user.roles : ['guest'];

        if (req.user) {
            if ((req.file && req.directory) && req.file.user.toString() === req.user.id && req.directory.user.toString() === req.user.id) {
                return callback();
            }

            if ((req.file && !req.directory) && req.file.user.toString() === req.user.id) {
                return callback();
            }

            if ((!req.file && req.directory) && req.directory.user.toString() === req.user.id) {
                return callback();
            }
        }

        // Check for user roles
        acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
            if (err) {
                // An authorization error occurred.
                return res.status(500).json({
                    message: 'Unexpected authorization error'
                });
            } else {
                if (isAllowed) {
                    // Access granted! Invoke next middleware
                    return callback();
                } else {
                    return res.status(500).json({
                        message: 'Unexpected authorization error'
                    });
                }
            }
        });
    };

    if (req.user) {
        return successCallback();
    }
    else {
        oauth2Service.isBearerAuthenticated(req, res, successCallback);
    }
};
