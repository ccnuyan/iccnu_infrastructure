'use strict';

module.exports = {
    secure: false,
    port: process.env.PORT || 8080,
    db: process.env.MONGOHQ_URL,
    tempDir: '/uploads/',
    redis:{
        ip:process.env.REDIS_IP,
        port:process.env.REDIS_PORT
    },
    openStackConfig: {
        cloudUrl: process.env.CLOUD_URL,
        cloudPort: '8080',
        cloudBox: 'iccnu-cloud-production',
        temp: 'iccnu-temp-production',
        xAuthUser: process.env.CLOUD_USER,
        xAuthKey: process.env.CLOUD_PASS
    },
    lrs_oauth_config: {
        authorizationURL: 'http://'+process.env.LRS_HOST+'/xAPI/oauth2/authorize',
        tokenURL: 'http://'+process.env.LRS_HOST+'/xAPI/oauth2/access_token',
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://'+process.env.INF_HOST+'/auth/iccnu/login',
        state: true
    },
    lrs_user_info_options: {
        host: process.env.LRS_HOST,
        port: 80,
        path: '/xAPI/oauth2/user_info',
        method: 'GET'
    },
    esConfig: {
        host: process.env.ENGINE_HOST,
        log: {
            type: 'file',
            level: 'trace',
            path: 'elasticsearch.prod.log'
        }
    }
};
