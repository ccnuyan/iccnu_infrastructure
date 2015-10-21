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

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3000';
});

// Nodemon task
gulp.task('nodemon', function () {
    return plugins.nodemon({
        script: 'server.js',
        nodeArgs: ['--debug'],
        ext: 'js,html',
        //watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
        watch: _.union(defaultAssets.server.views, defaultAssets.server.config)
    });
});

// CSS linting task
gulp.task('csslint', function (done) {
    var source = ['!modules/core/client/css/bootstrap.min.css'];

    defaultAssets.client.css.forEach(function (css) {
        source.push(css);
    });

    return gulp.src(source)
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.reporter())
        .pipe(plugins.csslint.reporter(function (file) {
            if (!file.csslint.errorCount) {
                done();
            }
        }));
});

// JS linting task
gulp.task('jshint', function () {
    return gulp.src(_.union(defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.jshint.reporter('fail'));
});

// JS minifying task
gulp.task('uglify', function () {
    return gulp.src(defaultAssets.client.js)
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.concat('application.min.js'))
        .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
    return gulp.src(defaultAssets.client.css)
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('application.min.css'))
        .pipe(gulp.dest('public/dist'));
});

gulp.task('lint', function (done) {
    runSequence('csslint', 'jshint', done);
});

gulp.task('test', function (done) {
    runSequence('env:test', ['mocha'], done);
});

gulp.task('debug', function (done) {
    runSequence('env:dev', 'lint', 'nodemon', done);
});

gulp.task('build', function (done) {
    runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});


