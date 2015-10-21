'use strict';


var path = require('path');
var config = require(path.resolve('./config/config'));
var elasticsearch = require('elasticsearch');

var client;

exports.getClient = function () {
    if (client) {
        return client;
    }
    else {
        client = elasticsearch.Client(config.esConfig);
        return client;
    }
};
