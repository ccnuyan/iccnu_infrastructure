'use strict';

var clientPolicy = require('../policies/client.server.policy');

module.exports = function (app) {

    var client = require('../controllers/client.server.controller');

    app.route('/api/clients').all(clientPolicy.isAllowed)
        .post(client.create)
        .get(client.read);
};
