'use strict';

var mongoose = require('mongoose');
var Questionnaire = mongoose.model('Questionnaire');

// Create the chat configuration
module.exports = function (io, socket) {

    socket.on('submit', function (submission) {

        var questionnaireId = submission.questionnaireId;

        var callback = function (err, questionnaire) {
            if (err) {
                return;
            }
            io.emit('update', questionnaire);
        };

        var updateDoc = {};

        updateDoc['choice' + submission.choice] = 1;

        Questionnaire.findByIdAndUpdate(questionnaireId, {$inc: updateDoc}, {
            new: true,
            upsert: false
        }).exec(callback);
    });
};
