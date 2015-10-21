'use strict';

module.exports = {
    app: {
        title: 'www.iccnu.net'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEAN',
    sessionCollection: 'sessions'
};
