'use strict';

module.exports = {
    client: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.min.css',
                'public/lib/components-font-awesome/css/font-awesome.min.css',

                'public/lib/angular-toastr/dist/angular-toastr.min.css'
            ],
            js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-bootstrap/ui-bootstrap.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-file-upload/angular-file-upload.js',

                'public/lib/angular-toastr/dist/angular-toastr.js',
                'public/lib/angular-toastr/dist/angular-toastr.tpls.js',

                'public/lib/qrcode-generator/js/qrcode.js',
                'public/lib/qrcode-generator/js/qrcode_UTF8.js',
                'public/lib/angular-qrcode/angular-qrcode.js'
            ],
            tests: ['public/lib/angular-mocks/angular-mocks.js']
        },
        css: [
            'modules/*/client/css/*.css'
        ],
        less: [
            'modules/*/client/less/*.less'
        ],
        sass: [
            'modules/*/client/scss/*.scss'
        ],
        js: [
            'modules/core/client/app/config.js',
            'modules/core/client/app/init.js',
            'modules/*/client/*.js',
            'modules/*/client/**/*.js'
        ],
        views: ['modules/*/client/views/**/*.html']
    },
    server: {
        allJS: ['gulpfile.js', 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
        models: ['modules/*/server/models/**/*.js'],
        routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
        sockets: 'modules/*/server/sockets/**/*.js',
        config: 'modules/*/server/config/*.js',
        policies: ['modules/*/server/policies/*.js'],
        views: 'modules/*/server/views/*.html'
    }
};
