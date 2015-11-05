'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');
var path = require('path');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var mongoose = require('mongoose');
var Directory = mongoose.model('Directory');
var User = mongoose.model('User');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Directory Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'resourceAdmin'],
        allows: [{
            resources: '/api/knowledgeNodes/',
            permissions: ['get']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/knowledgeNodes/',
            permissions: ['get']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/knowledgeNodes/',
            permissions: ['get']
        }]
    }]);
};

//for starc User
exports.isAllowed = function (req, res, callback) {
    return callback();
};
