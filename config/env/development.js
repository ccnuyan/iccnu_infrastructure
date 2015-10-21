'use strict';


module.exports = {
    db: 'mongodb://dianxin.mongo:8888/iccnu-yan-dev',
    port: 3000,
    app: {
        title: 'ICCNU - Development Environment'
    },
    tempDir: './uploads/',
    openStackConfig: {
        cloudUrl: 'dianxin.cloud',
        cloudPort: '8080',
        cloudBox: 'iccnu-cloud-dev',
        temp: 'iccnu-temp-dev',
        xAuthUser: 'system:root',
        xAuthKey: 'testpass'
    },
    esConfig: {
        host: 'dianxin.engine:9200',
        log: {
            type: 'file',
            level: 'trace',
            path: 'elasticsearch.dev.log'
        }
    },
    lrs_oauth_config: {
        authorizationURL: 'http://lrs.iccnu.net/xAPI/oauth2/authorize',
        tokenURL: 'http://lrs.iccnu.net/xAPI/oauth2/access_token',
        clientID: '9f93d625f00c6461b4af',
        clientSecret: '74c0d823032f0be85f95bf02b94c62c3709a7d55',
        callbackURL: 'http://localhost:3000/auth/iccnu/login',
        state: true
    },
    lrs_user_info_options: {
        host: 'lrs.iccnu.net',
        port: 80,
        path: '/xAPI/oauth2/user_info',
        method: 'GET'
    }
};
