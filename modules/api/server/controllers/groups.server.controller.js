/**
 * Created by zhonghua on 2015/7/30.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');
var User = mongoose.model('User');
var File = mongoose.model('File');
var Group = mongoose.model('Group');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.list = function (req, res, next) {
    var me = req.user;

    Group.find({user: me.id})
        .populate('members', '_id username displayName email')
        .populate('subFiles', '_id title')
        .populate('subFiles.fileObject')
        .exec(function (err, groups) {
            if (err) {
                return next({db: err});
            }

            var user = req.user.toUserStruct();
            user.groups = groups;
            return res.status(200).json(user);
        });
};

exports.info = function (req, res) {
    return res.status(200).json(req.group);
};

exports.create = function (req, res, next) {

    var group = new Group();
    group.name = req.body.name;
    group.user = req.user;

    group.save(function (err, groupCreated) {
        if (err) {
            return next({db: err});
        }

        return res.status(201).json(groupCreated);
    });
};

exports.edit = function (req, res, next) {
    var group = req.group;
    var updateGroup = {};
    if (req.body.name) updateGroup.name = req.body.name;
    if (req.body.members)  updateGroup.members = req.body.members;
    if (req.body.subFiles)  updateGroup.subFiles = req.body.subFiles;

    Group.findByIdAndUpdate(group.id, updateGroup)
        .populate('members', '_id username displayName email')
        .populate('subFiles', '_id title')
        .populate('subFiles.fileObject')
        .exec(function (err, Group) {
            if (err) {
                return next({db: err});
            }

            return res.status(200).json(Group);
        });
};

exports.remove = function (req, res, next) {
    var me = req.user;
    var group = req.group;

    group.remove(function (err, groupRemoved) {
        if (err) {
            return next({db: err});
        }
        File.update({user: me.id}, {$pull: {sharedGroups: group.id}}).exec(function () {
            return res.status(200).json(groupRemoved);
        });
    });
};

exports.groupByID = function (req, res, next, id) {
    Group.findById(id)
        .populate('members', '_id username displayName email')
        .populate('subFiles', '_id title')
        .populate('subFiles.fileObject')
        .exec(function (err, group) {
            if (err) {
                return next({db: err});
            }
            if (!group) {
                return next({message: 'group specified does not exist'});
            }
            req.group = group;
            return next();
        });
};
