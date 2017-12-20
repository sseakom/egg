'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;

    router.post('/', controller.home.index);

    router.post('/zhaopin', controller.home.zhaopin);

    router.post('/tiobe', controller.home.tiobe);
};