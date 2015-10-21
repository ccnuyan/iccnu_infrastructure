'use strict';

var mongoose = require('mongoose');

// Define our token schema
var AuthorizationCode = new mongoose.Schema({
    code: {type: String, required: true},
    redirectURI: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    clientId: {type: mongoose.Schema.Types.ObjectId, required: true}
});

// Export the Mongoose model
mongoose.model('AuthorizationCode', AuthorizationCode);
