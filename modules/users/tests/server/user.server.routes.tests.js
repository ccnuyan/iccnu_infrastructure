'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var request = require('supertest-as-promised');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var File = mongoose.model('File');
var Directory = mongoose.model('Directory');
var express = require(path.resolve('./config/lib/express'));

var app, agent, credentials, user, rootDirectory;

/**
 * Unit tests
 */
describe('User signup tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'testuser',
            password: 'testuser'
        };

        user = {
            username: 'testuser',
            password: 'testuser',
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'user@iccnu.net'
        };

        done();
    });

    it('should sign up with root directory', function (done) {

        agent.post('/api/auth/signup')
            .send(user)
            .expect(200)
            .then(function () {
                return agent.post('/api/auth/signin')
                    .send(credentials)
                    .expect(200);
            })
            .then(function (res) {
                rootDirectory = res.body.rootDirectory;
            })
            .then(function () {
                return agent.get('/api/disk/' + rootDirectory)
                    .expect(200);
            })
            .then(function (res) {
                (res.body._id).should.equal(rootDirectory);
                (res.body.depth).should.equal(0);
                done();
            });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Directory.remove().exec(done);
        });
    });
});
