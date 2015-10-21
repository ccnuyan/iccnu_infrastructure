'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies =
        ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.bootstrap.progressbar',
            'ui.utils', 'angularFileUpload', 'toastr', 'monospaced.qrcode'];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();


String.prototype.trunc =
    function (n) {
        var toLong = this.length > n,
            s_ = toLong ? this.substr(0, n - 1) : this;
        return toLong ? s_ + '...' : s_;
    };
