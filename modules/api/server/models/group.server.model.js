'use strict';

/**
 * Directory model definition
 *
 * @module Disk
 * @class Directory
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({

    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true,
        //todo better regular expression
        required: 'Group name cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
});

GroupSchema.path('name').validate(function (value) {
    if (!value)return false;

    var lengthFlag = value.length <= 32 && value.length >= 1;
    if (!lengthFlag)return false;

    var validCheck = /^[^\\\/\?\*\|]*$/.test(value);
    if (!validCheck)return false;

    return true;
}, 'Invalid name');

GroupSchema.path('name').validate(function (value) {
    if (!value)return false;
    return value.length <= 32 && value.length >= 1;
}, 'Invalid group name');

GroupSchema.methods.toGroupStruct = function () {
    var obj = {};
    obj._id = this._id;
    obj.user = this.user;
    obj.members = this.members;
    return obj;
};

mongoose.model('Group', GroupSchema);

