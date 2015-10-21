/**
 * Created by user on 2015/8/31.
 */
'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    TempFile = mongoose.model('TempFile');

var user, tempFile;

describe('临时文件model测试', function () {
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
            tempFile = new TempFile({
                name: 'tempFile Name.ext',
                size: 1024,
                user: user
            });
            done();
        });
    });

    it('临时文件保存应该没有问题', function (done) {
        return tempFile.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('临时文件名为空保存出错', function (done) {
        tempFile.name = '.abc';
        return tempFile.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('临时文件的用户为空保存出错', function (done) {
        tempFile.user = '';
        return tempFile.save(function (err) {
            should.exist(err);
            done();
        });
    });

    //it('临时文件名已存在保存出错',function(done){
    //    //file.save();
    //    //return file.save(function(err){
    //    //    should.exist(err);
    //    //    done();
    //    //});
    //});

    it('临时文件没有扩展名保存出错', function (done) {
        tempFile.name = 'abc';
        return tempFile.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('临时文件名(包含扩展名)太长(大于128个字符)保存出错', function (done) {
        tempFile.name = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234.abc';
        return tempFile.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it('临时文件名(包含扩展名)太长但去掉前后空格合法(小于等于128个字符)应该没问题', function (done) {
        tempFile.name = '                                                                             111.abc                                                                  ';
        return tempFile.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('临时文件名存在特殊字符(包括["*","?","/","\\","|"])保存出错', function (done) {
        tempFile.name = '**.abc';
        return tempFile.save(function (err) {
            should.exist(err);
            done();
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            TempFile.remove().exec(done);
        });
    });


});

