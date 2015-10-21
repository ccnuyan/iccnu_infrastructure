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
var chalk = require('chalk');

/**
 * Unit tests
 */
describe('网盘文件 CRUD 测试', function () {
    var app, agent, credentials, user, rootDirectory, fileId, extension, userId, newName, fileObj;

    before(function (done) {
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

        extension = '.png';
        newName = {
            name: 'test2.png'
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
                userId = res.body._id;
                rootDirectory = res.body.rootDirectory;
                fileObj = new File({
                    contentType: 'image/png',
                    name: 'test.png',
                    size: 45245,
                    user: mongoose.Types.ObjectId(userId),
                    parent: mongoose.Types.ObjectId(rootDirectory)
                });
                fileObj.save(function (err, fileSaved) {
                    if (err) {
                        done(err);
                    }
                    else {
                        fileId = fileSaved._id;
                        done();
                    }
                });
            });
    });


    describe('未登录用户应该不能对网盘文件进行CRUD操作', function () {
        beforeEach(function (done) {
            agent.get('/api/auth/signout')
                .send(user)
                .expect(302)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('未登录用户应该不能创建网盘文件', function (done) {
            agent.post('/api/diskUpload/' + rootDirectory)
                .send(fileObj)
                .attach('image', 'test_resources/' + fileObj.name)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('未登录用户应该不能查看网盘文件', function (done) {
            agent.get('/api/disk/' + rootDirectory + '/' + fileId)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('未登录用户应该不能修改网盘文件名', function (done) {
            agent.put('/api/disk/' + rootDirectory + '/' + fileId)
                .send(newName)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('未登录用户应该不能删除网盘文件', function (done) {
            agent.delete('/api/disk/' + rootDirectory + '/' + fileId)
                .expect(401)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

    });

    describe('登录用户应该不能对他人的网盘文件进行CRUD操作', function () {
        beforeEach(function (done) {
            var user1 = {
                username: 'testuser1',
                password: 'testuser1',
                firstName: 'firstname1',
                lastName: 'lastname1',
                email: 'user1@iccnu.net'
            };
            var credentials1 = {
                username: 'testuser1',
                password: 'testuser1'
            };
            agent.get('/api/auth/signout')
                .send(user)
                .expect(302)
                .then(function () {
                    agent.post('/api/auth/signup')
                        .send(user1)
                        .expect(200)
                        .then(function () {
                            return agent.post('/api/auth/signin')
                                .send(credentials1)
                                .expect(200)
                                .then(function () {
                                    done();
                                })
                                .catch(function (err) {
                                    done(err);
                                });
                        });
                });
        });

        it('登录用户应该不能对他人的网盘创建文件', function (done) {
            agent.post('/api/diskUpload/' + rootDirectory)
                .send(fileObj)
                .attach('image', 'test_resources/' + fileObj.name)
                .expect(500)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('登录用户应该不能查看他人网盘文件', function (done) {
            agent.get('/api/disk/' + rootDirectory + '/' + fileId)
                .expect(500)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('登录用户应该不能修改他人的网盘文件名', function (done) {
            agent.put('/api/disk/' + rootDirectory + '/' + fileId)
                .send(newName)
                .expect(500)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('登录用户应该不能删除他人的网盘文件', function (done) {

            agent.delete('/api/disk/' + rootDirectory + '/' + fileId)
                .expect(500)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

    });


    describe('登录用户应该能对自己的网盘文件进行CRUD操作', function () {

        it('登录用户应该能正确的上传网盘文件', function (done) {

            agent.post('/api/diskUpload/' + rootDirectory)
                .send(fileObj)
                .attach('image', 'test_resources/' + fileObj.name)
                .expect(201)
                .then(function () {
                    return agent.get('/api/disk/' + rootDirectory)
                        .expect(200);
                })
                .then(function (res) {
                    (res.body.subFiles[0].name).should.equal(fileObj.name);
                    (res.body.subFiles[0].size).should.equal(fileObj.size);
                    (res.body.subFiles[0].extension).should.equal(extension);
                })

                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('登录用户应该能查看网盘文件', function (done) {
            agent.get('/api/disk/' + rootDirectory + '/' + fileId)
                .expect(200)
                .then(function (res) {
                    (res.body.name).should.equal(fileObj.name);
                    (res.body.size).should.equal(fileObj.size);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('登录用户应该能修改自己的网盘文件名,但不能修改其扩展名', function (done) {

            var invalidNewName1 = 'test2.pn';
            var invalidNewName2 = 'test2.png1';
            var invalidNewName3 = 'test';
            agent.put('/api/disk/' + rootDirectory + '/' + fileId)
                .send(newName)
                .expect(200)
                .then(function (res) {
                    (res.body.name).should.equal(newName.name);
                    (res.body.extension).should.equal(extension);
                })
                .then(function () {
                    agent.put('/api/disk/' + rootDirectory + '/' + fileId)
                        .send(invalidNewName1)
                        .expect(400);
                })
                .then(function () {
                    agent.put('/api/disk/' + rootDirectory + '/' + fileId)
                        .send(invalidNewName2)
                        .expect(400);
                })
                .then(function () {
                    agent.put('/api/disk/' + rootDirectory + '/' + fileId)
                        .send(invalidNewName3)
                        .expect(400);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('登录用户应该能下载自己的网盘文件', function (done) {
            var uploadedFileId;
            agent.post('/api/diskUpload/' + rootDirectory)
                .send(fileObj)
                .attach('image', 'test_resources/' + fileObj.name)
                .expect(201)
                .then(function (res) {
                    uploadedFileId = res.body._id;
                })
                .then(function () {
                    agent.get('/api/diskDownload/' + rootDirectory + '/' + uploadedFileId)
                        .expect(200)
                        .then(function (res) {
                            done();
                        })
                        .catch(function (err) {
                            done(err);
                        });
                });
        });
        it('登录用户应该能删除自己的网盘文件', function (done) {
            agent.delete('/api/disk/' + rootDirectory + '/' + fileId)
                .expect(200)
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
            Directory.remove().exec(function () {
                File.remove().exec(done);
            });
        });
    });
});
