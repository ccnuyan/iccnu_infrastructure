'use strict';

/**
 * Disk API
 *
 * @module Disk
 * @main disk routes
 * @class disk.server.routes
 */
var questionnairePolicy = require('../policies/questionnaire.server.policy.js');
var questionnaire = require('../controllers/questionnaire.server.controller.js');

module.exports = function (app) {
    app.route('/api/questionnaires/').all(questionnairePolicy.isAllowed)
        .get(questionnaire.list)
        .post(questionnaire.create);

    app.route('/api/questionnaires/aggregate').all(questionnairePolicy.isAllowed)
        .get(questionnaire.aggregateByMonth);

    app.route('/api/questionnaires/:questionnaireId')
        .delete(questionnairePolicy.isAllowed, questionnaire.remove);

    app.route('/api/questionnaires/clear/:questionnaireId')
        .put(questionnairePolicy.isAllowed, questionnaire.clear);

    app.route('/api/questionnaires/:questionnaireId')
        .get(questionnaire.info);

    app.route('/api/questionnaire/attachments/:attachmentId')
        .get(questionnaire.downloadAttachment);

    app.param('attachmentId', questionnaire.attachmentByID);

    app.param('questionnaireId', questionnaire.questionnaireByID);
};
