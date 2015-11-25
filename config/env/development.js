'use strict';

module.exports = {
    //db: 'mongodb://dianxin.dev:8888/iccnu-inf-dev',
    db: 'mongodb://localhost:27017/iccnu-inf-dev',
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
    redis:{
        ip:'119.97.166.135',
        port:'6000'
    },
    lrs_oauth_config: {
        authorizationURL: 'http://122.204.161.146/xAPI/oauth2/authorize',
        tokenURL: 'http://122.204.161.146/xAPI/oauth2/access_token',
        clientID: '9f93d625f00c6461b4af',
        clientSecret: '74c0d823032f0be85f95bf02b94c62c3709a7d55',
        callbackURL: 'http://localhost:3000/auth/iccnu/login',
        state: true
    },
    lrs_user_info_options: {
        host: '122.204.161.146',
        port: 80,
        path: '/xAPI/oauth2/user_info',
        method: 'GET'
    },
    //lrs_oauth_config: {
    //    authorizationURL: 'http://web.local:8000/xAPI/oauth2/authorize',
    //    tokenURL: 'http://web.local:8000/xAPI/oauth2/access_token',
    //    clientID: '9f93d625f00c6461b4af',
    //    clientSecret: '74c0d823032f0be85f95bf02b94c62c3709a7d55',
    //    callbackURL: 'http://localhost:3000/auth/iccnu/login',
    //    state: true
    //},
    //lrs_user_info_options: {
    //    host: 'web.local',
    //    port: 8000,
    //    path: '/xAPI/oauth2/user_info',
    //    method: 'GET'
    //},
    esConfig: {
        host: '119.97.166.135:9200',
        log: {
            type: 'file',
            level: 'trace',
            path: 'elasticsearch.dev.log'
        }
    }
};
