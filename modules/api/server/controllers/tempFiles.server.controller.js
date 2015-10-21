'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');

var TempFileObject = mongoose.model('TempFileObject');
var swiftInitializer = require('../services/swiftInitializer.js');

var client = require('../services/elasticSearchService.js').getClient();

var cloudBox = config.openStackConfig.temp;

exports.upload = function (req, res, next) {

    var tempFileObject = new TempFileObject();

    tempFileObject.user = req.user;

    swiftInitializer.init(function (err, swift) {

        if (err) {
            return next({message: 'cloud storage error'});
        }

        swift.createObject(cloudBox, tempFileObject.id, function (err, ret) {
            if (err || ret.statusCode !== 201) {
                return next({message: 'cloud storage create object error'});
            }

            swift.retrieveObjectMetadata(cloudBox, tempFileObject.id, function (err, ret) {
                if (err || ret.statusCode !== 200) {
                    return next({message: 'cloud storage retrieve object error'});
                }


                // req now has openStack info
                tempFileObject.contentType = ret.headers['content-type'];
                tempFileObject.size = ret.headers['content-length'];
                tempFileObject.name = req.openstack.fileName;
                tempFileObject.etag = ret.headers.etag;

                tempFileObject.save(function (err, retFile) {
                    if (err) {
                        return next({db: err});
                    }
                    return res.status(201).json(retFile);
                });
            });
        }, req);
    });
};

exports.tempFileByID = function (req, res, next, id) {
    TempFileObject.findById(id)
        .exec(function (err, tempFileObject) {
            if (err) {
                return next({db: err});
            }
            if (!tempFileObject) {
                return next({message: 'file specified does not exist'});
            }

            req.tempFileObject = tempFileObject;
            return next();
        });
};
