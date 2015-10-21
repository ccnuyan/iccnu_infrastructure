'use strict';

/**
 * Disk API
 *
 * @module Disk
 * @main disk routes
 * @class disk.server.routes
 */
var friendPolicy = require('../policies/friend.server.policy.js');
var friend = require('../controllers/friends.server.controller');

module.exports = function (app) {
    app.route('/api/friends/').all(friendPolicy.isAllowed)
        .get(friend.friends);

    app.route('/api/friends/:targetId').all(friendPolicy.isAllowed)
        .get(friend.info)
        .post(friend.submit)
        .put(friend.decision)
        .delete(friend.delete);

    app.route('/api/friendSearch/:username').all(friendPolicy.isAllowed)
        .get(friend.info);

    app.param('targetId', friend.friendByID);
    app.param('username', friend.friendByUserName);
};
