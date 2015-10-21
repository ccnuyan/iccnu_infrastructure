'use strict';

/**
 * Disk API
 *
 * @module Disk
 * @main disk routes
 * @class disk.server.routes
 */
var knowledgeNodePolicy = require('../policies/knowledgeNode.server.policy.js');
var knowledgeNode = require('../controllers/knowledgeNodes.server.controller.js');

module.exports = function (app) {
    app.route('/api/knowledgeNodes').all(knowledgeNodePolicy.isAllowed)
        .get(knowledgeNode.list);

    app.route('/api/knowledgeNodes/:knowledgeNodeId')
        .get(knowledgeNode.read);

    app.route('/api/knowledgeNodeSearch')
        .get(knowledgeNode.search);


    app.param('knowledgeNodeId', knowledgeNode.knowledgeNodeById);
};
