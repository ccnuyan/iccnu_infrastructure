'use strict';
// Load required packages
var jwt = require('jwt-simple');
var accessTokenSecret = 'iccnu';

exports.decode = function (token) {
    return jwt.decode(token, accessTokenSecret, 'HS256');
};

exports.sendLocalToken = function (user, res) {
    var payload = {
        iss: 'www:iccnu.net',
        sub: user.id,
        aud: 'local'
    };

    var token = jwt.encode(payload, accessTokenSecret, 'HS256');

    res.json({
        user: user.toGetMeStruct(),
        token: token
    });
};

exports.createAccessToken = function (username, clientid, scope) {
    var payload = {
        iss: 'www:iccnu.net',
        sub: username,
        aud: clientid,
        scope: scope
    };

    if (scope) {
        payload.scope = scope;
    }
    else {
        payload.scope = 'full';
    }

    return jwt.encode(payload, accessTokenSecret, 'HS256');
};
