'use strict';

/**
 * Disk API
 *
 * @module Disk
 * @main disk routes
 * @class disk.server.routes
 */
var resourcesPolicy = require('../policies/resource.server.policy.js');
var directory = require('../controllers/directories.server.controller');
var resource = require('../controllers/resources.server.controller');
var file = require('../controllers/files.server.controller');
var tempFile = require('../controllers/tempFiles.server.controller');

module.exports = function (app) {

    app.route('/api/rsadmin/resources/').all(resourcesPolicy.isRsAdminAllowed)
        .get(resource.rsAdminList);

    app.route('/api/rsadmin/resources/:resourceId').all(resourcesPolicy.isRsAdminAllowed)
        .post(resource.decision);

    app.route('/api/resourceSearch/')
        .get(resource.search);

    app.route('/api/resources/').all(resourcesPolicy.isAllowed)
        .get(resource.list);

    app.route('/api/resourceByFile/:fileId').all(resourcesPolicy.isAllowed)
        .post(resource.createByFile);

    app.route('/api/resourceByTempFile/:tempFileId').all(resourcesPolicy.isAllowed)
        .post(resource.createByTempFile);

    app.route('/api/resourceByLink/').all(resourcesPolicy.isAllowed)
        .post(resource.createByLink);

    app.route('/api/resourcesSiteInfo')
        .get(resource.resourcesSiteInfo);

    app.route('/api/resources/:resourceId').all(resourcesPolicy.isAllowed)
        .put(resource.edit)
        .delete(resource.delete);

    app.route('/api/resourcesHit/:resourceId')
        .post(resource.downloadHit);

    app.route('/api/resourceDownload/:resourceId')
        .get(resource.download);

    app.route('/api/resourcesImport/')
        .post(resource.import);

    app.param('resourceId', resource.resourceByID);
    app.param('tempFileId', tempFile.tempFileByID);
};
