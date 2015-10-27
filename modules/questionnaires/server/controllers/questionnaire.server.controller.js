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
var Questionnaire = mongoose.model('Questionnaire');
var TempFileObject = mongoose.model('TempFileObject');
var File = mongoose.model('File');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var swiftInitializer = require('../../../api/server/services/swiftInitializer.js');

var cloudBox = config.openStackConfig.cloudBox;
var tempBox = config.openStackConfig.temp;

exports.list = function (req, res, next) {
    var me = req.user;

    var condition = {user: me.id};

    if (req.query.year && req.query.month) {
        condition.created = {
            $gte: new Date(req.query.year, Number(req.query.month) - 1, 1),
            $lt: new Date(req.query.year, Number(req.query.month), 1)
        };
    }

    Questionnaire.find(condition)
        .populate('user', '_id username email')
        .populate('image')
        .sort({
            created: 'desc'
        })
        .exec(function (err, questionnaires) {
            if (err) {
                return next({db: err});
            }

            return res.status(200).json(questionnaires);
        });
};

exports.aggregateByMonth = function (req, res, next) {
    Questionnaire.aggregate([{
        $group: {
            _id: {year: {$year: '$created'}, month: {$month: '$created'}},
            count: {$sum: 1}
        }
    }])
        .exec(function (err, ret) {
            if (err) {
                return next({db: err});
            }
            return res.status(200).json(ret);
        });
};

exports.info = function (req, res) {
    return res.status(200).json(req.questionnaire);
};

exports.create = function (req, res, next) {

    var questionnaire = new Questionnaire();

    questionnaire.user = req.user._id;
    questionnaire.choices = req.body.choices;
    questionnaire.title = req.body.title;

    TempFileObject.findById(req.body.tempFileId)
        .exec(function (err, tempFile) {

            var tempFileObject = tempFile.toObject();
            delete tempFileObject.id;
            tempFileObject.usage = 'questionnaire';

            var file = new File(tempFileObject);

            swiftInitializer.init(function (err, swift) {
                if (err) {
                    return next({message: 'cloud storage error'});
                }

                //在云里把临时文件复制到使用的文件
                swift.copyObject(cloudBox, file._id, tempBox, tempFile._id, function (opsErr, opsRet) {
                    if (opsErr || opsRet.statusCode !== 201) {
                        return next({message: 'cloud storage copy object error'});
                    }
                    //使用的文件保存
                    file.save(function (err, fileUsedRet) {
                        if (err) {
                            return next({db: err});
                        }
                        questionnaire.image = fileUsedRet;
                        questionnaire.save(function (err, retQn) {
                            if (err) {
                                return next({db: err});
                            }
                            return res.status(200).json(retQn);
                        });
                    });
                });
            });
        });
};

exports.clear = function (req, res, next) {
    var questionnaire = req.questionnaire;
    questionnaire.clearSubmissions();

    questionnaire.save(function (err, questionNew) {
        if (err) {
            return next({db: err});
        }
        return res.status(200).json(questionNew);
    });
};

exports.remove = function (req, res, next) {
    var questionnaire = req.questionnaire;

    questionnaire.remove(function (err, questionnaireRemoved) {
        if (err) {
            return next({db: err});
        }

        return res.status(200).json(questionnaireRemoved);
    });
};

exports.downloadAttachment = function (req, res, next) {
    var attachment = req.questionnaireAttachment;

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return next({message: 'cloud storage error'});
        }

        swift.getFile(cloudBox, attachment.id, function (err) {
            if (err) {
                return next({message: 'cloud storage get file error'});
            } else {
                return res.status(200).send();
            }
        }, res);
    });
};

exports.attachmentByID = function (req, res, next, id) {
    File.findById(id)
        .exec(function (err, attachment) {
            if (err) {
                return next({db: err});
            }
            if (!attachment) {
                return next({message: 'questionnaireAttachment specified does not exist'});
            }
            req.questionnaireAttachment = attachment;
            return next();
        });
};

exports.questionnaireByID = function (req, res, next, id) {
    Questionnaire.findById(id)
        .populate('image')
        .exec(function (err, questionnaire) {
            if (err) {
                return next({db: err});
            }
            if (!questionnaire) {
                return next({message: 'questionnaire specified does not exist'});
            }
            req.questionnaire = questionnaire;
            return next();
        });
};
