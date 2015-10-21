/**
 * Created by user on 2015/8/31.
 */
'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    File = mongoose.model('File');

var user, file;

describe('网盘文件model测试', function () {
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
            file = new File({
                name: 'File Name.ext',
                size: 1024,
                parent: user._id,
                user: user
            });
            done();
        });
    });

    it('文件保存应该没有问题', function (done) {
        return file.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('文件名为空保存出错', function (done) {
        file.name = '.abc';
        return file.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('文件的用户为空保存出错', function (done) {
        file.user = '';
        return file.save(function (err) {
            should.exist(err);
            done();
        });
    });

    //it('文件名已存在保存出错',function(done){
    //    file.save();
    //    return file.save(function(err){
    //        should.exist(err);
    //        done();
    //    });
    //});

    it('文件没有扩展名保存出错', function (done) {
        file.name = 'abc';
        return file.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('文件名(包含扩展名)太长(大于128个字符)保存出错', function (done) {
        file.name = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234.abc';
        return file.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('文件名(包含扩展名)太长但去掉前后空格合法(小于等于128个字符)应该没问题', function (done) {
        file.name = '                                                                             111.abc                                                                  ';
        return file.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('文件名存在特殊字符(包括["*","?","/","\\","|"])保存出错', function (done) {
        file.name = '**.abc';
        return file.save(function (err) {
            should.exist(err);
            done();
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            File.remove().exec(done);
        });
    });
});

