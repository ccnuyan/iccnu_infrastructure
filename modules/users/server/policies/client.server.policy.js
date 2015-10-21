'use strict';

var acl = require('acl');
var oauth2Service = require('../services/oauth2.server.service.js');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/clients',
            permissions: ['get', 'post']
        }]
    }]);
};

exports.isAllowed = function (request, response, callback) {
    // If an article is being processed and the current user created it then allow any manipulation
    if (request.user) {
        return callback();
    }
    else {
        oauth2Service.isBearerAuthenticated(request, response, callback);
    }
};
