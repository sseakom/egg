'use strict';

module.exports = appInfo => {
    const config = exports = {
        cors: {
            origin: '*',
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
        },
        mongoose: {
            url: 'mongodb://106.14.222.172:27027/node',
            // 是否加载到 app 上，默认开启
            app: true,
            // 是否加载到 agent 上，默认关闭
            agent: false,
        }
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1513070020499_1566';

    // add your config here
    config.middleware = ['request', 'query'];

    return config;
};