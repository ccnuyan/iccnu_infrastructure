'use strict';

/**
 * Directory model definition
 *
 * @module Disk
 * @class File
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    choices: {
        type: Number,
        required: true
    },
    choiceA: {
        type: Number,
        default: 0
    },
    choiceB: {
        type: Number,
        default: 0
    },
    choiceC: {
        type: Number,
        default: 0
    },
    choiceD: {
        type: Number,
        default: 0
    },
    choiceE: {
        type: Number,
        default: 0
    },
    choiceF: {
        type: Number,
        default: 0
    },
    choiceG: {
        type: Number,
        default: 0
    },
    choiceH: {
        type: Number,
        default: 0
    },
    image: {
        type: Schema.ObjectId,
        ref: 'File'
    }
});


/**
 * Create instance method for hashing a password
 */
QuestionnaireSchema.methods.clearSubmissions = function () {
    this.choiceA = 0;
    this.choiceB = 0;
    this.choiceC = 0;
    this.choiceD = 0;
    this.choiceE = 0;
    this.choiceF = 0;
    this.choiceG = 0;
    this.choiceH = 0;
};
mongoose.model('Questionnaire', QuestionnaireSchema);
