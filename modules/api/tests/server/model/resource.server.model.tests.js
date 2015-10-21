/**
 * Created by user on 2015/8/31.
 */
'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Resource = mongoose.model('Resource');

var user, resource;

describe('资源model测试', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: '名',
            lastName: '姓',
            displayName: '姓名',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        user.save(function () {
            resource = new Resource({
                title: 'Resource1',
                description: 'Resource1',
                user: user
            });
            done();
        });
    });

    it('资源保存应该没有问题', function (done) {
        return resource.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('资源标题为空保存出错', function (done) {
        resource.title = '';
        return resource.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('上传资源的用户为空保存出错', function (done) {
        resource.user = '';
        return resource.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('资源描述为空保存出错', function (done) {
        resource.description = '';
        return resource.save(function (err) {
            should.exist(err);
            done();
        });
    });

    describe('资源meta类型测试', function () {

        it('资源meta类型不是file或link时保存出错', function (done) {
            resource.res_meta_type = 'meta';
            return resource.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('资源meta类型是link时保存正常', function (done) {
            resource.res_meta_type = 'link';
            resource.res_link = 'www.iccnu.net';
            return resource.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('资源meta类型为link时res_link为空，保存出错', function (done) {
            resource.res_meta_type = 'link';
            resource.res_link = '';
            return resource.save(function (err) {
                should.exist(err);
                done();
            });
        });

        describe('资源meta类型为file时的测试', function (done) {

            beforeEach(function (done) {
                resource.res_meta_type = 'file';
                resource.res_file = {
                    name: 'resFile.exe',
                    extension: '.exe'
                };
                done();
            });

            it('资源meta类型是file时保存正常', function (done) {
                return resource.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('资源meta类型为file时res_file为空，保存出错', function (done) {
                resource.res_file = '';
                return resource.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

            it('资源meta类型为file时res_file的名字为空，保存出错', function (done) {
                resource.res_file.name = '';
                return resource.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

            it('资源meta类型为file时res_file的扩展名为空，保存出错', function (done) {
                resource.res_file.extension = '';
                return resource.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

        });

    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Resource.remove().exec(done);
        });
    });

});

