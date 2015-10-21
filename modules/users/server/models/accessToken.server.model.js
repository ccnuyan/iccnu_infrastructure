'use strict';

var mongoose = require('mongoose');

// Define our token schema
var AccessTokenSchema = new mongoose.Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    clientId: {type: mongoose.Schema.Types.ObjectId, required: true},
    scope: {type: String}
});

// Export the Mongoose model
mongoose.model('AccessToken', AccessTokenSchema);
