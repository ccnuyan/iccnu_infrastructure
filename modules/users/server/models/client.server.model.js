'use strict';

// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our client schema
var ClientSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, unique: true, required: true},
    secret: {type: String, required: true},
    description: {type: String, required: true},
    authType: {type: String, required: true},
    redirectURI: {type: String},
    homeURI: {type: String, required: true}
});

// Execute before each user.save() call
ClientSchema.pre('save', function (callback) {
    var client = this;

    // Break out if the secret hasn't changed
    if (!client.isModified('secret')) {
        return callback();
    }

    // secret changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) {
            return callback(err);
        }

        bcrypt.hash(client.secret, salt, null, function (err, hash) {
            if (err) {
                return callback(err);
            }
            client.secret = hash;
            callback();
        });
    });
});

ClientSchema.methods.isCodeAuthType = function () {
    return this.authType === 'code';
};

ClientSchema.methods.isResourceOwnerAuthType = function () {
    return this.authType === 'resource_owner';
};

ClientSchema.methods.verifySecret = function (secret, cb) {
    bcrypt.compare(secret, this.secret, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// Exclude secret before sending back to client;
ClientSchema.methods.toClientWithoutSecretHash = function () {
    var obj = this.toObject();
    delete obj.secret;

    return obj;
};

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);

