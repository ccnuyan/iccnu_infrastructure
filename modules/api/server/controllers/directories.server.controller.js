'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var mongoose = require('mongoose');
var Directory = mongoose.model('Directory');
var File = mongoose.model('File');
var FileObject = mongoose.model('FileObject');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function (req, res, next) {
    var parentDirectory = req.directory;

    if (req.directory.depth < 2) {

        var directoryToCreate = new Directory();
        directoryToCreate.name = req.body.name;
        directoryToCreate.user = req.user;
        directoryToCreate.parent = parentDirectory;
        directoryToCreate.depth = parentDirectory.depth + 1;

        parentDirectory.subDirectories.push(directoryToCreate._id);

        parentDirectory.save(function (err) {
            if (err) {
                return next({db: err});
            } else {
                directoryToCreate.save(function (err, retDir) {
                    if (err) {
                        return next({db: err});
                    } else {
                        return res.status(201).json(retDir.toDirectoryStruct());
                    }
                });
            }
        });
    } else {
        return next({message: 'too deep'});
    }
};

exports.read = function (req, res) {
    return res.status(200).json(req.directory.toDirectoryStruct());
};

exports.update = function (req, res, next) {
    var directory = req.directory;

    if (directory.depth === 0) {
        return next({message: 'not allowed to update the root directory'});
    }

    directory.name = req.body.name;
    directory.save(function (err, retDir) {
        if (err) {
            return next({db: err});
        } else {
            return res.status(200).json(retDir.toDirectoryStruct());
        }
    });
};

exports.delete = function (req, res, next) {
    var directory = req.directory;

    if (directory.depth === 0) {
        return next({message: 'not allowed to remove the root directory'});
    }

    if ((!directory.subDirectories || directory.subDirectories.length === 0) &&
        (!directory.subFiles || directory.subFiles.length === 0)) {
        Directory.findByIdAndUpdate(directory.parent,
            {$pull: {subDirectories: directory._id}})
            .exec(function (outerError) {
                if (outerError) {
                    return next({db: outerError});
                }
                directory.remove(function (err, retDir) {
                    if (err) {
                        return next({db: err});
                    } else {
                        return res.status(200).json(retDir.toDirectoryStruct());
                    }
                });
            });
    }
    else {
        return next({message: 'you must clear the directory first'});
    }
};

exports.dirByID = function (req, res, next, id) {

    Directory.findById(id)
        .populate({
            path: 'subDirectories',
            match: null,
            options: {sort: {created: 1}}
        })
        .populate({
            path: 'subFiles',
            match: null,
            options: {sort: {created: 1}}
        })
        .exec(function (err, directory) {
            if (err) {
                return next({db: err});
            }
            if (!directory) {
                return next({message: 'directory specified does not exist'});
            }

            FileObject.populate(directory, {
                path: 'subFiles.fileObject'
            }, function (err, directoryPopulated) {
                if (err) {
                    return next({db: err});
                }
                req.directory = directoryPopulated;
                return next();
            });
        });
};

exports.targetByID = function (req, res, next, id) {
    Directory.findById(id)
        .exec(function (err, directory) {
            if (err) {
                return next({db: err});
            }
            if (!directory) {
                next({message: 'target directory specified does not exist'});
            }

            req.targetDirectory = directory;
            return next();
        });
};

exports.sourceByID = function (req, res, next, id) {
    Directory.findById(id)
        .exec(function (err, directory) {
            if (err) {
                next({db: err});
            }
            if (!directory) {
                next({message: 'source directory specified does not exist'});
            }

            req.sourceDirectory = directory;
            return next();
        });
};
