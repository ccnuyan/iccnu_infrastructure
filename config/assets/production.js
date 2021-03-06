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
                'public/lib/angular/angular.min.js',
                'public/lib/angular-ui-utils/ui-utils.min.js',
                'public/lib/angular-ui-router/release/angular-ui-router.min.js',
                'public/lib/angular-bootstrap/ui-bootstrap.min.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'public/lib/angular-resource/angular-resource.min.js',
                'public/lib/angular-animate/angular-animate.min.js',
                'public/lib/angular-file-upload/angular-file-upload.min.js',

                'public/lib/angular-toastr/dist/angular-toastr.min.js',
                'public/lib/angular-toastr/dist/angular-toastr.tpls.min.js',

                'public/lib/qrcode-generator/js/qrcode.js',
                'public/lib/qrcode-generator/js/qrcode_UTF8.js',
                'public/lib/angular-qrcode/angular-qrcode.js'
            ]
        },
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    }
};
