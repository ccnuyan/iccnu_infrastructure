'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var KnowledgeNodeSchema = new Schema({
    title: {
        type: String
    },
    code: {
        type: String
    },
    subject: {
        type: String
    }
});


mongoose.model('KnowledgeNode', KnowledgeNodeSchema);
