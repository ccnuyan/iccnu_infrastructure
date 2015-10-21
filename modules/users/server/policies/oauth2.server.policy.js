'use strict';

var acl = require('acl');
var oauth2Service = require('../services/oauth2.server.service.js');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/oauth2/authorize',
            permissions: ['get', 'post']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/oauth2/authorize',
            permissions: ['get', 'post']
        }]
    }]);
};

exports.isAllowed = function (request, response, callback) {
    if (request.user) {
        return callback();
    }
    else {
        oauth2Service.isBearerAuthenticated(request, response, callback);
    }
};
