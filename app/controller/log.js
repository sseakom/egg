'use strict';
const fs = require('fs');
const Controller = require('egg').Controller;

class LogController extends Controller {

    async agent() {
        console.log('log:', this.ctx.request.body);
        const fsRes = await fs.readFileSync(process.cwd() + '/logs/egg/egg-agent.log');
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: fsRes.toString()
        };
    }
    async web() {
        console.log('log:', this.ctx.request.body);
        const fsRes = await fs.readFileSync(process.cwd() + '/logs/egg/egg-web.log');
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: fsRes.toString()
        };
    }
    async error() {
        console.log('log:', this.ctx.request.body);
        const fsRes = await fs.readFileSync(process.cwd() + '/logs/egg/common-error.log');
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: fsRes.toString()
        };
    }
}

module.exports = LogController;