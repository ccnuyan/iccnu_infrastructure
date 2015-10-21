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

exports.friends = function (req, res, next) {
    User.findById(req.user.id)
        .populate('submissions', '_id username displayName email')
        .populate('friends', '_id username displayName email')
        .exec(function (err, me) {
            if (err) {
                return next({db: err});
            }
            return res.status(200).json(me.toFriendsStruct());
        });
};

exports.submit = function (req, res, next) {

    var me = req.user;
    var target = req.target;

    if (target.id === me.id) {
        return next({message: 'you can not be friend of yourself'});
    }

    if (target.friends && target.friends.indexOf(me.id) >= 0 &&
        me.friends && me.friends.indexOf(target.id) >= 0) {
        return next({message: 'you are already friends'});
    }

    if (target.submissions && target.submissions.indexOf(me.id) >= 0) {
        return next({message: 'you have submitted ,just waiting for the approval'});
    }

    User.findByIdAndUpdate(target.id,
        {$push: {submissions: me.id}},
        function (err, targetUser) {
            if (err) {
                return next({db: err});
            }
            return res.status(201).json(targetUser.toUserStruct());
        });
};

exports.info = function (req, res) {
    return res.status(200).json(req.target.toUserStruct());
};

exports.infoByUserName = function (req, res) {
    return res.status(200).json(req.target.toUserStruct());
};

exports.decision = function (req, res, next) {

    var me = req.user;
    var target = req.target;

    if (target.id === me.id) {
        User.findByIdAndUpdate(me.id, {$pull: {submissions: target.id}})
            .populate('submissions', '_id username displayName email')
            .populate('friends', '_id username displayName email')
            .exec(function (err, newMe) {
                if (err) {
                    return next({db: err});
                }
                return res.status(200).json(newMe.toFriendsStruct());
            });
    } else {

        if (!me.submissions || me.submissions.indexOf(target.id) < 0) {
            return next({message: 'this user has not submit a friend to you'});
        }

        if (req.body.decision === 'approve') {
            User.findByIdAndUpdate(me.id,
                {$push: {friends: target.id}, $pull: {submissions: target.id}})
                .populate('submissions', '_id username displayName email')
                .populate('friends', '_id username displayName email')
                .exec(function (err, newMe) {
                    if (err) {
                        return next({db: err});
                    }
                    User.findByIdAndUpdate(target.id,
                        {$push: {friends: me.id}, $pull: {submissions: me.id}})
                        .exec(function (err, targetUser) {
                            if (err) {
                                return next({db: err});
                            }

                            return res.status(200).json(newMe.toFriendsStruct());
                        });
                });
        } else if (req.body.decision === 'reject') {
            User.findByIdAndUpdate(me.id, {$pull: {submissions: target.id}})
                .populate('submissions', '_id username displayName email')
                .populate('friends', '_id username displayName email')
                .exec(function (err, newMe) {
                    if (err) {
                        return next({db: err});
                    }
                    return res.status(200).json(newMe.toFriendsStruct());
                });
        }
    }
};

exports.delete = function (req, res, next) {

    var me = req.user;
    var target = req.target;

    User.findByIdAndUpdate(target.id,
        {$pull: {submissions: me.id, friends: me.id}})
        .exec(function (err, targetUser) {
            if (err) {
                return next({db: err});
            }
            File.update({user: target.id}, {$pull: {sharedUsers: me.id}}).exec(function () {
                Group.update({user: target.id}, {$pull: {members: me.id}}).exec(function () {

                    User.findByIdAndUpdate(me.id,
                        {$pull: {submissions: target.id, friends: target.id}})
                        .populate('submissions', '_id username displayName email')
                        .populate('friends', '_id username displayName email')
                        .exec(function (err, newMe) {
                            if (err) {
                                return next({db: err});
                            }

                            File.update({user: me.id}, {$pull: {sharedUsers: target.id}}).exec(function () {
                                Group.update({user: me.id}, {$pull: {members: target.id}}).exec(function () {
                                    return res.status(200).json(newMe.toFriendsStruct());
                                });
                            });
                        });
                });
            });
        });
};

exports.friendByID = function (req, res, next, id) {
    User.findById(id)
        .exec(function (err, target) {
            if (err) {
                return next({db: err});
            }
            if (!target) {
                return next({message: 'target user specified does not exist'});
            }
            req.target = target;
            return next();
        });
};

exports.friendByUserName = function (req, res, next, username) {
    User.findOne({username: username})
        .exec(function (err, target) {
            if (err) {
                return next({db: err});
            }
            if (!target) {
                return next({message: 'target user specified does not exist'});
            }
            req.target = target;
            return next();
        });
};
