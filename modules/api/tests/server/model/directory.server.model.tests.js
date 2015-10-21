/**
 * Created by user on 2015/8/31.
 */
'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Directory = mongoose.model('Directory');

var user, directory;

describe('网盘目录model测试', function () {
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
            directory = new Directory({
                name: 'directoryName',
                depth: '0',
                user: user
            });
            done();
        });
    });

    it('目录保存应该没有问题', function (done) {
        return directory.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('目录名为空保存出错', function (done) {
        directory.name = '';
        return directory.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('目录的用户为空保存出错', function (done) {
        directory.user = '';
        return directory.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('目录名已存在保存出错',
        undefined
        //function(done){
        //directory.save();
        //return directory.save(function(err){
        //    should.exist(err);
        //    done();
        //});
        //}
    );

    it('目录名太长(大于32个字符)保存出错', function (done) {
        directory.name = '111111111111111111111111111111111';
        return directory.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('目录名太长但去掉前后空格合法(小于等于32个字符)应该没问题', function (done) {
        directory.name = '1                    111              ';
        return directory.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('目录名存在特殊字符(包括["*","?","/","\\","|"])保存出错', function (done) {
        directory.name = '1122*22';
        return directory.save(function (err) {
            should.exist(err);
            done();
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Directory.remove().exec(done);
        });
    });

});

