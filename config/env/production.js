'use strict';

module.exports = {
    secure: false,
    port: process.env.PORT || 8080,
    db: process.env.MONGOHQ_URL,
    tempDir: '/uploads/',
    openStackConfig: {
        cloudUrl: process.env.CLOUD_URL,
        cloudPort: '8080',
        cloudBox: 'iccnu-cloud-production',
        temp: 'iccnu-temp-production',
        xAuthUser: process.env.CLOUD_USER,
        xAuthKey: process.env.CLOUD_PASS
    },
    esConfig: {
        host: process.env.ENGINE_HOST,
        log: {
            type: 'file',
            level: 'trace',
            path: 'elasticsearch.prod.log'
        }
    },
    lrs_oauth_config: {
        authorizationURL: 'http://119.97.166.148/xAPI/oauth2/authorize',
        tokenURL: 'http://119.97.166.148/xAPI/oauth2/access_token',
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://119.97.166.139/auth/iccnu/login',
        state: true
    },
    lrs_user_info_options: {
        host: '119.97.166.148',
        port: 80,
        path: '/xAPI/oauth2/user_info',
        method: 'GET'
    }
};
