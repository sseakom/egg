const Subscription = require('egg').Subscription;
const request = require('request-promise');
const cheerio = require('cheerio');

class JobSpider extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '12h',
            type: 'all',
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const thisDate = new Date().setHours(0, 0, 0, 0) + "";
        const tiobeBody = await request('https://www.tiobe.com/tiobe-index/');
        const tiobe = cheerio.load(tiobeBody);
        const self = this;
        let rankList = [];
        const month = tiobe('.table').eq(0).find('thead').find('tr').find('th').eq(0).text();
        const rankRes = await this.ctx.model.Rank.find({
            'month': month
        })
        if (rankRes.length > 0) {
            console.log('有重复记录', month);
            for (let key in rankRes) {
                rankList.push(rankRes[key].name)
            }
        } else {
            console.log('开始记录', month);
            tiobe('.table').each(function() {
                if (tiobe(this).find('thead').find('tr').find('th').eq(3).text() == 'Programming Language') {
                    tiobe(this).find('tbody').find('tr').each(function() {
                        let name = '';
                        const text = tiobe(this).find('td').eq(3).text().toLocaleLowerCase();
                        if (text == 'javascript') {
                            name = 'web'
                        } else if (text == 'visual basic .net') {
                            name = '.net'
                        } else if (text == 'assembly language') {
                            name = 'assembly'
                        } else if (text == 'objective-c') {
                            name = 'ios'
                        } else if (text == 'visual basic') {
                            name = 'vb'
                        } else if (text == 'pl/sql') {
                            name = 'sql'
                        } else if (text == 'delphi/object pascal') {
                            name = 'delphi'
                        } else {
                            name = text
                        }
                        self.ctx.model.Rank.create({
                            name: name,
                            rank: parseInt(tiobe(this).find('td').eq(0).text()),
                            month: month,
                        })
                        rankList.push(name)
                    })
                }
            })
        }
        const jobRes = await this.ctx.model.Job.find({ time: thisDate });
        console.log('jobRes.length: ', jobRes.length);
        if (rankList.length && !jobRes.length) {
            for (let key in rankList) {
                const zhaopinBody = await request('http://zhaopin.baidu.com/quanzhi?query=' + encodeURI(rankList[key]));
                const zhaopin = cheerio.load(zhaopinBody);
                await this.ctx.model.Job.create({
                    name: rankList[key],
                    count: zhaopin('.result-num b').text(),
                    time: thisDate,
                })
            }
        }

    }
}

module.exports = JobSpider;