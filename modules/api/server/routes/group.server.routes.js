'use strict';

/**
 * Disk API
 *
 * @module Disk
 * @main disk routes
 * @class disk.server.routes
 */
var groupPolicy = require('../policies/group.server.policy.js');
var friend = require('../controllers/friends.server.controller');
var group = require('../controllers/groups.server.controller');
var file = require('../controllers/files.server.controller');

module.exports = function (app) {
    app.route('/api/groups/').all(groupPolicy.isAllowed)
        .get(group.list)
        .post(group.create);

    app.route('/api/groups/:groupId').all(groupPolicy.isAllowed)
        .get(group.info)
        .put(group.edit)
        .delete(group.remove);

    app.param('groupId', group.groupByID);
};
