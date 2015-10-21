'use strict';

var passport = require('passport');

var Client = require('mongoose').model('Client');

exports.isClientBasicAuthenticated = passport.authenticate('client-basic', {session: false});
exports.isClientPasswordAuthenticated = passport.authenticate('client-password', {session: false});
exports.isBearerAuthenticated = passport.authenticate('client-bearer', {session: false});

