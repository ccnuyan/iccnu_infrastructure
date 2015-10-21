'use strict';

module.exports = {
    db: 'mongodb://dianxin.mongo:8888/iccnu-test',
    port: 3001,
    app: {
        title: 'ICCNU - Test Environment'
    },
    openStackConfig: {
        cloudUrl: '119.97.166.140',
        cloudPort: '8080',
        cloudBox: 'iccnu-cloud-test',
        temp: 'iccnu-temp-test',
        xAuthUser: 'system:root',
        xAuthKey: 'testpass'
    },
    esConfig: {
        host: 'ubuntu:9200',
        log: {
            type: 'file',
            level: 'trace',
            path: 'elasticsearch.test.log'
        }
    },
    lrs_oauth_config: {
        authorizationURL: 'http://localhost:8000/xAPI/oauth2/authorize',
        tokenURL: 'http://localhost:8000/xAPI/oauth2/access_token',
        clientID: '937b816e4ffd91c89fb2',
        clientSecret: '37a43641139949278b5597f85f804b3d6e51e185',
        callbackURL: 'http://localhost:3000/auth/iccnu/login',
        state: true
    },
    lrs_user_info_options: {
        host: 'localhost',
        port: 8000,
        path: '/xAPI/oauth2/user_info',
        method: 'GET'
    }
};
