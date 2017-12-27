'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;

    router.get('/', controller.home.index);

    router.post('/zhaopin', controller.post.zhaopin);

    router.post('/tiobe', controller.post.tiobe);
    router.post('/chart', controller.post.chart);

    router.post('/log/agent', controller.log.agent);
    router.post('/log/web', controller.log.web);
    router.post('/log/error', controller.log.error);
};