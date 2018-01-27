'use strict';
const fs = require('fs');
const Controller = require('egg').Controller;

class PostController extends Controller {
    async allHouse() {
        console.log('allHouse:', this.ctx.request.body);
        const crawlingDate = new Date().setHours(0, 0, 0, 0) + "";
        const req = this.ctx.request.body;
        let pageSize = 10;
        let pageNo = 1;
        if (req.pageSize > 0) {
            pageSize = req.pageSize
        }
        if (req.pageNo > 0) {
            pageNo = req.pageNo
        }
        const allRes = await this.ctx.model.House.find({ crawlingDate });
        const res = await this.ctx.model.House.find({ crawlingDate }).limit(pageSize).skip(pageSize * (pageNo - 1));
        this.ctx.body = {
            code: 200,
            msg: '成功',
            count: allRes.length,
            result: res,
        };
    }
    async tiobe() {
        console.log('tiobe:', this.ctx.request.body);
        const rankRes = await this.ctx.model.Rank.find();
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: rankRes,
        };
    }
    async zhaopin() {
        console.log('zhaopin:', this.ctx.request.body);
        const zhaopinRes = await this.ctx.model.Job.find();
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: zhaopinRes,
        };
    }
    async chart() {
        console.log('chart:', this.ctx.request.body);
        let res = [];
        const jobRes = await this.ctx.model.Job.find({ name: 'java' });
        for (let key in jobRes) {
            res.push({ date: new Date(parseInt(jobRes[key].time)).Format("yyyy-MM-dd") })
            let list = await this.ctx.model.Job.find({ time: jobRes[key].time }).select('-_id name count')
            for (let k in list) {
                res[res.length - 1][list[k].name] = list[k].count;
            }
        }
        console.log('res: ', res);
        this.ctx.body = {
            code: 200,
            msg: '成功',
            result: res,
        };
    }
}

module.exports = PostController;