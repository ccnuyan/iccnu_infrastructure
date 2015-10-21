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
var Resource = mongoose.model('Resource');
var KnowledgeNode = mongoose.model('KnowledgeNode');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var client = require('../services/elasticSearchService.js').getClient();


exports.search = function (req, res, next) {

    //SQL -- ES
    //schema -- mappings
    //database -- index
    //table -- type
    //column -- property

    var searchParams = {};
    var matches = [];

    matches.push({match: {title: req.query.term}});
    matches.push({match: {description: req.query.term}});
    matches.push({match: {code: req.query.term}});

    searchParams.dis_max = {queries: matches};

    var filter = {and: []};
    var filterFlag = false;

    if (req.query.subject) {
        filterFlag = true;
        filter.and.push({term: {subject: req.query.subject}});
    }

    var searchBody = {
        fields: [],
        query: searchParams
    };

    if (filterFlag) {
        searchBody.filter = filter;
    }

    client.search({
        index: 'iccnu',
        type: 'knowledgeNodes',
        body: searchBody
    }, function (error, response) {

        if (error) {
            return res.status(200).json([]);
        }

        var ids = [];

        response.hits.hits.forEach(function (hit) {
            ids.push(hit._id);
        });

        if (response && !response.timeout) {
            KnowledgeNode.find({_id: {$in: ids}})
                .exec(function (err, nodes) {
                    if (err) {
                        return next({db: err});
                    }

                    return res.status(200).json(nodes);
                });
        }
    });
};

exports.list = function (req, res, next) {
    KnowledgeNode.find(req.query)
        .sort({
            code: 'asc'
        })
        .exec(function (err, knowledgeNodes) {
            if (err) {
                return next({db: err});
            }
            return res.status(200).json(knowledgeNodes);
        });
};

exports.read = function (req, res, next) {
    Resource.find({knowledgeNode: req.knowledgeNode.id})
        .populate('knowledgeNode')
        .sort({
            code: 'asc'
        })
        .exec(function (err, resources) {
            if (err) {
                return next({db: err});
            }
            return res.status(200).json(resources);
        });
};

exports.knowledgeNodeById = function (req, res, next, id) {
    KnowledgeNode.findById(id)
        .exec(function (err, knowledgeNode) {
            if (err) {
                return next({db: err});
            }
            if (!knowledgeNode) {
                return next({message: 'knowledge node specified does not exist'});
            }
            req.knowledgeNode = knowledgeNode;
            return next();
        });
};
