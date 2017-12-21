'use strict';
const fs = require('fs');
const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        console.log(this.app.router.stack);
        this.ctx.body = this.app.router.stack;
    }
    async tiobe() {
        console.log('tiobe:', this.ctx.request.body);
        const rankRes = await this.ctx.model.Rank.find();
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: rankRes,
        }
    }
    async zhaopin() {
        console.log('zhaopin:', this.ctx.request.body);
        const zhaopinRes = await this.ctx.model.Job.find();
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: zhaopinRes,
        }
    }
}

module.exports = HomeController;