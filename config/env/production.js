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
        authorizationURL: 'http://lrs.iccnu.net/xAPI/oauth2/authorize',
        tokenURL: 'http://lrs.iccnu.net/xAPI/oauth2/access_token',
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://inf.iccnu.net:8180/auth/iccnu/login',
        state: true
    },
    lrs_user_info_options: {
        host: 'lrs.iccnu.net',
        port: 80,
        path: '/xAPI/oauth2/user_info',
        method: 'GET'
    }
};