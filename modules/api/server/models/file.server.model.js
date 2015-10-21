'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
    name: {
        type: String
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
    fileObject: {
        type: Schema.ObjectId,
        ref: 'FileObject'
    },
    sharedUsers: {
        type: [{
            type: Schema.ObjectId,
            ref: 'User'
        }]
    },
    sharedGroups: {
        type: [{
            type: Schema.ObjectId,
            ref: 'Group'
        }]
    }
});

mongoose.model('File', FileSchema);
