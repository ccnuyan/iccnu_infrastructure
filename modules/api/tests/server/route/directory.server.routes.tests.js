'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
//var request = require('supertest');
var request = require('supertest-as-promised');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var File = mongoose.model('File');
var Directory = mongoose.model('Directory');
var express = require(path.resolve('./config/lib/express'));
var chalk = require('chalk');

var app, agent, credentials, user, rootDirectory, directory, subDirectory, subSubDirectory, file, newDir;

/**
 * Unit tests
 */
describe('网盘目录 CRUD 测试', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {

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

        directory = {
            name: 'Directory Name'
        };
        subDirectory = {
            name: 'Sub Directory Name'
        };
        subSubDirectory = {
            name: 'Sub Sub Directory Name'
        };

        newDir = {
            name: 'New Name'
        };
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
                done();
            })
            .catch(function (err) {
                done(err);
            });

    });

    describe('未登录用户应该不能对网盘目录进行CRUD操作', function () {

        beforeEach(function (done) {
            agent.get('/api/auth/signout')
                .send(user)
                .expect(302)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done();
                });
        });

        it('未登录用户应该不能查看网盘目录', function (done) {

            agent.get('/api/disk/' + rootDirectory)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('未登录用户应该不能创建网盘目录', function (done) {
            agent.post('/api/disk/' + rootDirectory)
                .send(directory)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('未登录用户应该不能修改网盘目录名', function (done) {
            agent.put('/api/disk/' + rootDirectory)
                .send(newDir)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('未登录用户应该不能删除网盘目录', function (done) {
            agent.delete('/api/disk/' + rootDirectory)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

    });


    it('登录用户应该能创建两级目录，且不能在二级目录下创建子目录', function (done) {
        var parent, subParent;
        agent.post('/api/disk/' + rootDirectory)
            .send(directory)
            .expect(201)
            .then(function (res) {
                (res.body.name).should.equal(directory.name);
                parent = res.body._id;
                return agent.post('/api/disk/' + parent)
                    .send(subDirectory)
                    .expect(201);
            })
            .then(function (res) {
                (res.body.name).should.equal(subDirectory.name);
                subParent = res.body._id;
                return agent.post('/api/disk/' + subParent)
                    .send(subSubDirectory)
                    .expect(400);
            })
            .then(function () {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });

    describe('登录用户的查改删', function () {
        var parent, subParent;
        beforeEach(function (done) {
            agent.post('/api/disk/' + rootDirectory)
                .send(directory)
                .expect(201)
                .then(function (res) {
                    (res.body.name).should.equal(directory.name);
                    parent = res.body._id;
                    return agent.post('/api/disk/' + parent)
                        .send(subDirectory)
                        .expect(201);
                })
                .then(function (res) {
                    (res.body.name).should.equal(subDirectory.name);
                    subParent = res.body._id;
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('登录用户应该能正常查询目录、其子目录及其父目录信息', function (done) {
            agent.get('/api/disk/' + rootDirectory)
                .expect(200)
                .then(function (res) {
                    (res.body.subDirectories[0]._id).should.equal(parent);
                    return agent.get('/api/disk/' + parent)
                        .expect(200);
                })
                .then(function (res) {
                    (res.body.subDirectories[0]._id).should.equal(subParent);
                    (res.body.parent).should.equal(rootDirectory);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('登录用户应该能更改子目录名，但不能更改根目录名', function (done) {
            agent.put('/api/disk/' + subParent)
                .send(newDir)
                .expect(200)
                .then(function (res) {
                    (res.body.name).should.equal(newDir.name);
                    return agent.put('/api/disk/' + parent)
                        .send(newDir)
                        .expect(200);
                })
                .then(function (res) {
                    (res.body.name).should.equal(newDir.name);
                    return agent.put('/api/disk/' + rootDirectory)
                        .send(newDir)
                        .expect(400);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('登录用户应该能删除叶子目录，但不能删除有子目录的目录及根目录', function (done) {
            agent.delete('/api/disk/' + rootDirectory)
                .expect(400)
                .then(function () {
                    return agent.delete('/api/disk/' + parent)
                        .expect(400);
                })
                .then(function () {
                    return agent.delete('/api/disk/' + subParent)
                        .expect(200);
                })
                .then(function (res) {
                    return agent.get('/api/disk/' + parent)
                        .expect(200);
                })
                .then(function (res) {
                    (res.body.subDirectories.length).should.equal(0);
                    return agent.delete('/api/disk/' + parent)
                        .expect(200);
                })
                .then(function (res) {
                    return agent.get('/api/disk/' + rootDirectory)
                        .expect(200);
                })
                .then(function (res) {
                    (res.body.subDirectories.length).should.equal(0);
                    return agent.delete('/api/disk/' + rootDirectory)
                        .expect(400);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Directory.remove().exec(done);
        });
    });
});
