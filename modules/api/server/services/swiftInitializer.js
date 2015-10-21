'use strict';

var path = require('path');
var config = require(path.resolve('./config/config'));
var Swift = require('./swift.js');

var cloudAuthPath = '/auth/v1.0/';

var cloudUrl = config.openStackConfig.cloudUrl;
var cloudPort = config.openStackConfig.cloudPort;
var xAuthUser = config.openStackConfig.xAuthUser;
var xAuthKey = config.openStackConfig.xAuthKey;

exports.init = function (callback) {
    var swift = new Swift({
        user: xAuthUser,
        pass: xAuthKey,
        host: cloudUrl,
        path: cloudAuthPath,
        port: cloudPort
    }, function (err, res) {
        if (swift.account && swift.token) {
            return callback(null, swift);
        } else {
            return callback('swift auth failed: ' + err);
        }
    });
};
