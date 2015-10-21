'use strict';

var path = require('path');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');
var Directory = mongoose.model('Directory');
var Group = mongoose.model('Group');
var File = mongoose.model('File');

var FileObject = mongoose.model('FileObject');
var TempFileObject = mongoose.model('TempFileObject');
var RemovedFileObject = mongoose.model('RemovedFileObject');

var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var swiftInitializer = require('../services/swiftInitializer.js');

var cloudBox = config.openStackConfig.cloudBox;
var tempBox = config.openStackConfig.temp;

exports.read = function (req, res) {
    return res.status(200).json(req.file);
};

exports.update = function (req, res, next) {
    var file = req.file;
    var fileObject = req.file.fileObject;

    var newName = req.body.name;
    var idx = newName.indexOf(fileObject.extension);

    if (idx < 0 || idx !== (newName.length - fileObject.extension.length)) {
        return next({message: 'not allowed to modify the file extension'});
    }

    file.name = newName;

    if (req.body.sharedUsers)file.sharedUsers = req.body.sharedUsers;
    if (req.body.sharedGroups)file.sharedGroups = req.body.sharedGroups;

    file.save(function (err, retDiskFile) {
        if (err) {
            return next({db: err});
        } else {
            return res.status(200).json(retDiskFile);
        }
    });
};

exports.delete = function (req, res, next) {
    var directory = req.directory;
    var file = req.file;
    var fileObject = req.file.fileObject;

    Directory.findByIdAndUpdate(directory._id, {$pull: {subFiles: file._id}})
        .exec(function (outerError) {
            if (outerError) {
                return next({db: outerError});
            }
            file.remove();
            fileObject.remove();
            var removedFileObject = new RemovedFileObject(fileObject.toObject());
            removedFileObject.save();

            return res.status(200).json(file);
        });
};

exports.create = function (req, res, next) {
    var directory = req.directory;
    var tempFileObject = req.tempFileObject;

    var tfObj = tempFileObject.toObject();
    delete tfObj.id;

    var fileObject = new FileObject(tfObj);

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return next({message: 'cloud storage error'});
        }

        //在云里把临时文件复制到使用的文件
        swift.copyObject(cloudBox, fileObject._id, tempBox, tempFileObject._id, function (opsErr, opsRet) {
            if (opsErr || opsRet.statusCode !== 201) {
                return next({message: 'cloud storage copy object error'});
            }
            //创建网盘文件对象
            var file = new File();
            file.user = req.user;

            //使用的文件保存
            fileObject.save(function (err, fileObjectRet) {
                if (err) {
                    return next({db: err});
                }
                file.fileObject = fileObjectRet;
                file.name = fileObjectRet.name;

                file.save(function (err, fileRet) {
                    if (err) {
                        return next({db: err});
                    }

                    directory.subFiles.push(fileRet._id);

                    directory.save(function (err) {
                        if (err) {
                            return next({db: err});
                        }
                        return res.status(201).json(fileRet);
                    });
                });
            });
        });
    });
};

//查看target给me的共享
exports.getShare = function (req, res, next) {

    var me = req.user;
    var target = req.target;


    Group.find({user: target.id, members: me.id})
        .exec(function (err, groups) {
            if (err) {
                return next({db: err});
            }

            var gps = [];
            groups.forEach(function (gp) {
                gps.push(gp._id);
            });
            File.find(
                {
                    $or: [
                        {
                            user: target.id,
                            sharedGroups: {$elemMatch: {$in: gps}}
                        },
                        {
                            user: target.id,
                            sharedUsers: me.id
                        }
                    ]
                }, '_id title')
                .populate('fileObject')
                .exec(function (err, files) {
                    if (err) {
                        return next({db: err});
                    }

                    var retUser = target.toUserStruct();
                    retUser.sharedFiles = files;
                    return res.status(200).send(retUser);
                });
        });
};

exports.move = function (req, res, next) {

    var sourceDir = req.sourceDirectory;
    var targetDir = req.targetDirectory;

    var file = req.file;

    if (targetDir._id.toString() === sourceDir._id.toString() ||
        sourceDir.subFiles.indexOf(file.id) < 0 ||
        sourceDir.user.toString() !== req.user._id.toString() ||
        targetDir.user.toString() !== req.user._id.toString() ||
        targetDir.subFiles.indexOf(file.id) >= 0) {

        return next({message: 'not allowed'});
    }

    Directory.findByIdAndUpdate(targetDir._id, {$push: {subFiles: file._id}})
        .populate('subDirectories', '_id name subDirectories subFiles depth')
        .populate('subFiles', '_id title')
        .populate('subFiles.fileObject')
        .exec(function (err1, newTargetDir) {
            if (err1) {
                return next({db: err1});
            }
            Directory.findByIdAndUpdate(sourceDir._id, {$pull: {subFiles: file._id}})
                .populate('subDirectories', '_id name subDirectories subFiles depth')
                .populate('subFiles', '_id title')
                .populate('subFiles.fileObject')
                .exec(function (err2, newSourceDir) {
                    if (err2) {
                        return next({db: err2});
                    }

                    var ret = {};
                    ret.source = newSourceDir.toDirectoryStruct();
                    ret.target = newTargetDir.toDirectoryStruct();
                    ret.file = file;

                    return res.status(200).json(ret);
                });
        });
};

var downloadDiskFile = function (req, res, file, next) {

    res.attachment(file.fileObject.name);

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return next({message: 'cloud storage error'});
        }
        swift.getFile(cloudBox, file.fileObject.id, function (err) {
            if (err) {
                return next({db: err});
            }
            else {
                return res.status(200).send();
            }
        }, res);
    });
};

exports.download = function (req, res, next) {
    var file = req.file;
    var me = req.user;

    if (file.user.equals(me._id)) {
        downloadDiskFile(req, res, file, next);
    }
    else {
        return next({message: 'not allowed download this file'});
    }
};

exports.shareDownload = function (req, res, next) {
    var file = req.file;
    var me = req.user;

    if (file.sharedUsers.indexOf(me.id) >= 0) {
        downloadDiskFile(req, res, file, next);
    }
    else {
        File.findById(file.id)
            .populate('sharedGroups')
            .exec(function (err, fileWithGroups) {
                if (err) {
                    return next({db: err});
                }

                var flag = false;
                fileWithGroups.sharedGroups.forEach(function (group) {
                    if (group.members.indexOf(me.id) >= 0) {
                        flag = true;
                    }
                });

                if (flag) {
                    downloadDiskFile(req, res, file, next);
                } else {
                    return next({message: 'not allowed download this file'});
                }
            });
    }
};

exports.fileByID = function (req, res, next, id) {
    File.findById(id)
        .populate('fileObject')
        .exec(function (err, file) {
            if (err) {
                return next({db: err});
            }
            if (!file) {
                return next({message: 'disk file specified does not exist'});
            }

            req.file = file;
            return next();
        });
};
