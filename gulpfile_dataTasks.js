'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    swiftInitializer = require('./modules/api/server/services/swiftInitializer.js');

gulp.task('es-importKnowledgeNodes', function (done) {

    //process.env.NODE_ENV = 'develepmment';
    process.env.NODE_ENV = 'production';
    process.env.MONGOHQ_URL = 'mongodb://www.iccnu.net:30000/iccnu';

    // Open mongoose connections
    var mongoose = require('./config/lib/mongoose.js');

    // Connect mongoose
    mongoose.connect(function () {

        var KnowledgeNode = require('mongoose').model('KnowledgeNode');
        var path = require('path');
        var config = require(path.resolve('./config/config'));
        var elasticsearch = require('elasticsearch');
        var client = new elasticsearch.Client(config.esConfig);

        ////SQL -- ES
        ////schema -- mappings
        ////database -- index
        ////table -- type
        ////column -- property

        KnowledgeNode.find()
            .exec(function (err, knowledges) {
                var body = [];
                console.log(knowledges.length);
                knowledges.forEach(function (knode) {
                    body.push({index: {_index: 'iccnu', _type: 'knowledgeNodes', _id: knode._id}});
                    delete knode._id;
                    var nodeObj = knode.toObject();
                    delete nodeObj._id;
                    body.push(nodeObj);
                });

                client.bulk(
                    {
                        body: body
                    }, function (err, ret) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('succeeded:' + ret.items.length);
                        }
                        mongoose.disconnect(function () {
                            done();
                        });
                    });
            });
    });
});

gulp.task('es-importResources', function (done) {

    //process.env.NODE_ENV = 'develepmment';
    process.env.NODE_ENV = 'production';
    process.env.MONGOHQ_URL = 'mongodb://www.iccnu.net:30000/iccnu';

    // Open mongoose connections
    var mongoose = require('./config/lib/mongoose.js');

    // Connect mongoose
    mongoose.connect(function () {

        var Resource = require('mongoose').model('Resource');
        var path = require('path');
        var config = require(path.resolve('./config/config'));
        var elasticsearch = require('elasticsearch');
        var client = new elasticsearch.Client(config.esConfig);

        ////SQL -- ES
        ////schema -- mappings
        ////database -- index
        ////table -- type
        ////column -- property

        Resource.find({status: 'approved'})
            .populate('knowledgeNode')
            .exec(function (err, resources) {
                var body = [];
                console.log('total:' + resources.length);
                resources.forEach(function (resourcenode) {

                    var esResObj = {};
                    esResObj.title = resourcenode.title;
                    esResObj.description = resourcenode.description;
                    esResObj.resourceType = resourcenode.res_type;

                    if (resourcenode.knowledgeNode) {
                        esResObj.subjectCode = resourcenode.knowledgeNode.subject;
                        esResObj.knowledgeNodeName = resourcenode.knowledgeNode.title;
                        esResObj.knowledgeNode = resourcenode.knowledgeNode._id;
                    }

                    body.push({index: {_index: 'iccnu', _type: 'resources', _id: resourcenode._id}});
                    body.push(esResObj);
                });

                client.bulk(
                    {
                        body: body
                    }, function (err, ret) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('succeeded:' + ret.items.length);
                        }
                        mongoose.disconnect(function () {
                            done();
                        });
                    });
            });
    });
});

// Set NODE_ENV to 'development'
gulp.task('ops-deleteContainer', function (done) {

    var container = 'iccnu-temp';

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return done({message: 'cloud storage error'});
        }
        console.log(container);

        swift.deleteContainer(container, function (opsErr, opsRet) {
            console.log(opsRet.statusCode);
            if (opsErr || opsRet.statusCode !== 204) {
                console.log(opsErr);
                done('cloud storage delete container error');
            } else {
                console.log('cloud storage delete container ok');
                done();
            }
        });
    });
});

gulp.task('ops-createContainer', function (done) {

    var container = 'iccnu-cloud-dev';

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return done({message: 'cloud storage error'});
        }

        console.log(container);

        //在云里把临时文件复制到使用的文件
        swift.createContainer(container, function (opsErr, opsRet) {
            if (opsErr || opsRet.statusCode !== 201) {
                console.log(opsErr);
                done('cloud storage create container error');
            } else {
                console.log('cloud storage create container ok');
                done();
            }
        });
    });
});

gulp.task('ops-listContainers', function (done) {

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return done({message: 'cloud storage error'});
        }

        //在云里把临时文件复制到使用的文件
        swift.listContainers(function (opsErr, opsRet) {
            if (opsErr || opsRet.statusCode !== 200) {
                console.log(opsErr);
                done('cloud storage list container error');
            } else {
                console.log('containers:');
                var containers = JSON.parse(opsRet.body);
                containers.forEach(function (container) {
                    console.log(container);
                });
                done();
            }
        });
    });
});