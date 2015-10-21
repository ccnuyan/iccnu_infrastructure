'use strict';

/**
 * Disk API
 *
 * @module Disk
 * @main disk routes
 * @class disk.server.routes
 */
var diskPolicy = require('../policies/disk.server.policy.js');
var friendPolicy = require('../policies/friend.server.policy.js');
var directory = require('../controllers/directories.server.controller');
var friend = require('../controllers/friends.server.controller');
var resource = require('../controllers/resources.server.controller');
var file = require('../controllers/files.server.controller');
var tempFile = require('../controllers/tempFiles.server.controller');

module.exports = function (app) {

    app.route('/api/disk/:directoryId').all(diskPolicy.isAllowed)
        .get(directory.read)
        .put(directory.update)
        .post(directory.create)
        .delete(directory.delete);

    app.route('/api/disk/:directoryId/:fileId').all(diskPolicy.isAllowed)
        .get(file.read)
        .put(file.update)
        .delete(file.delete);

    app.route('/api/diskAdd/:directoryId/:tempFileId').all(diskPolicy.isAllowed)
        .post(file.create);

    app.route('/api/diskDownload/:directoryId/:fileId').all(diskPolicy.isAllowed)
        .get(file.download);

    app.route('/api/share/:targetId').all(friendPolicy.isAllowed)
        .get(file.getShare);

    app.route('/api/shareDownload/:fileId').all(friendPolicy.isAllowed)
        .get(file.shareDownload);

    app.route('/api/move/:sourceDirectoryId/:targetDirectoryId/:fileId/').all(diskPolicy.isAllowed)
        .put(file.move);

    app.route('/api/tempUpload/').all(diskPolicy.isAllowed)
        .post(tempFile.upload);

    app.param('directoryId', directory.dirByID);
    app.param('sourceDirectoryId', directory.sourceByID);
    app.param('targetDirectoryId', directory.targetByID);
    app.param('fileId', file.fileByID);
};
