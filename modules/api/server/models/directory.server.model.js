'use strict';

/**
 * Directory model definition
 *
 * @module Disk
 * @class Directory
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DirectorySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true,
        //todo better regular expression
        required: 'Directory name cannot be blank'
    },
    depth: {
        type: Number
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: Schema.ObjectId,
        ref: 'Directory'
    },
    subDirectories: [{
        type: Schema.ObjectId,
        ref: 'Directory'
    }],
    subFiles: [{
        type: Schema.ObjectId,
        ref: 'File'
    }]
});

DirectorySchema.path('name').validate(function (value) {
    if (!value)return false;

    var lengthFlag = value.length <= 32 && value.length >= 1;
    if (!lengthFlag)return false;

    var validCheck = /^[^\\\/\?\*\|]*$/.test(value);
    if (!validCheck)return false;

    return true;
}, 'Invalid name');


DirectorySchema.methods.toDirectoryStruct = function () {
    var obj = {};
    obj._id = this._id;
    obj.subDirectories = this.subDirectories || [];
    obj.subFiles = this.subFiles || [];
    obj.name = this.name;
    obj.depth = this.depth;
    obj.parent = this.parent;
    return obj;
};

mongoose.model('Directory', DirectorySchema);
