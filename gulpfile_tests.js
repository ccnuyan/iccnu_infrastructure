'use strict';

var _ = require('lodash'),
    defaultAssets = require('./config/assets/default'),
    testAssets = require('./config/assets/test'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    plugins = gulpLoadPlugins();

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
    process.env.NODE_ENV = 'test';
});

// Mocha tests task
gulp.task('mocha', function (done) {

    process.env.NODE_ENV = 'test';

    // Open mongoose connections
    var mongoose = require('./config/lib/mongoose.js');
    var error;

    // Connect mongoose
    mongoose.connect(function () {

        // Run the tests
        gulp.src(testAssets.tests.server)
            .pipe(plugins.mocha({
                reporter: 'spec'
            }))
            .on('error', function (err) {
                // If an error occurs, save it
                error = err;
                console.log(err);
            })
            .on('end', function () {
                // When the tests are done, disconnect mongoose and pass the error state back to gulp
                mongoose.disconnect(function () {
                    done(error);
                });
            });
    });
});

// Mocha tests task
gulp.task('mochaone', function (done) {

    process.env.NODE_ENV = 'test';

    // Open mongoose connections
    var mongoose = require('./config/lib/mongoose.js');
    var error;

    // Connect mongoose
    mongoose.connect(function () {
        // Run the tests
        gulp.src('modules/api/tests/server/route/file.server.routes.tests.js')
            .pipe(plugins.mocha({
                reporter: 'spec'
            }))
            .on('error', function (err) {
                // If an error occurs, save it
                error = err;
                console.log(err);
            })
            .on('end', function () {
                // When the tests are done, disconnect mongoose and pass the error state back to gulp
                mongoose.disconnect(function () {
                    done(error);
                });
            });
    });
});


