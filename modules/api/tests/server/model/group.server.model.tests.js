/**
 * Created by user on 2015/8/31.
 */
'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group');

var user, group;

describe('组model测试', function () {
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
            group = new Group({
                name: '组1',
                user: user
            });
            done();
        });
    });

    it('组构建应该没有问题', function (done) {
        return group.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('组名为空保存出错', function (done) {
        group.name = '';
        return group.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('创建组的用户为空保存出错', function (done) {
        group.user = '';
        return group.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('组名已存在保存出错', function (done) {
        group.save();
        return group.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('组名太长(大于32个字符)保存出错', function (done) {
        group.name = '012345678901234567890123456789012';
        return group.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('组名太长但去掉前后空格合法(小于等于32个字符)应该没问题', function (done) {
        group.name = '                     111                     ';
        return group.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('组名存在特殊字符(包括["*","?","/","\\","|"])保存出错', function (done) {
        group.name = '**';
        return group.save(function (err) {
            should.exist(err);
            done();
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Group.remove().exec(done);
        });
    });

});

