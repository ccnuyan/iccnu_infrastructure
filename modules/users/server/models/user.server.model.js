'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Directory model definition
 *
 * @module Users
 * @class User
 */

/**
 * User Schema
 */
var UserSchema = new Schema({
    /**
     * @attribute firstName
     * @readOnly
     * @required
     * @type String
     */
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    /**
     * @attribute lastName
     * @readOnly
     * @required
     * @type String
     */
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    /**
     * @attribute displayName
     * @readOnly
     * @required
     * @type String
     */
    displayName: {
        type: String,
        trim: true
    },
    /**
     * @attribute email
     * @readOnly
     * @required
     * @type String
     */
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    /**
     * @attribute username
     * @readOnly
     * @required
     * @type String
     */
    username: {
        type: String,
        unique: 'this user name has been registered',
        required: 'Please fill in a username',
        trim: true
    },
    profileImageURL: {
        type: String,
        default: 'modules/users/img/profile/default.png'
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin', 'resourceAdmin']
        }],
        default: ['user']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    rootDirectory: {
        type: Schema.ObjectId,
        ref: 'Directory'
    },
    friends: {
        type: [{
            type: Schema.ObjectId,
            ref: 'User'
        }]
    },
    submissions: {
        type: [{
            type: Schema.ObjectId,
            ref: 'User'
        }]
    }
});

/**
 * Hook a pre save method to hash the password
 */

var Directory = mongoose.model('Directory');

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.rootDirectory) {
        var userRoot = new Directory({
            name: 'root',
            user: this,
            depth: 0
        });
        userRoot.save(function (err, retDir) {
            if (err) {
                return next({db: err});
            } else {
                user.rootDirectory = retDir;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.methods.toFriendsStruct = function () {
    var obj = {};
    obj._id = this._id;
    obj.displayName = this.displayName;
    obj.rootDirectory = this.rootDirectory;
    obj.username = this.username;
    obj.email = this.email;
    obj.friends = this.friends || [];
    obj.submissions = this.submissions || [];
    return obj;
};

UserSchema.methods.toUserStruct = function () {
    var obj = {};
    obj._id = this._id;
    obj.displayName = this.displayName;
    obj.username = this.username;
    obj.email = this.email;
    return obj;
};

UserSchema.methods.toGetMeStruct = function () {
    var obj = {};
    obj._id = this._id;
    obj.roles = this.roles;
    obj.displayName = this.displayName;
    obj.username = this.username;
    obj.email = this.email;
    obj.rootDirectory = this.rootDirectory;
    obj.provider = this.provider;
    return obj;
};

mongoose.model('User', UserSchema);
