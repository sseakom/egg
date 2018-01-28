const Subscription = require('egg').Subscription;
const request = require('request-promise');
const cheerio = require('cheerio');
const Ut = require('../utils/index.js')

class Housing extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '12h',
            type: 'all',
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        console.log("HousingSchedule");
        const crawlingDate = new Date().setHours(0, 0, 0, 0) + "";
        const self = this;
        let totalPage = 1;
        const indexBody = await request("http://wuhu.58.com/ershoufang/");
        const index = cheerio.load(indexBody);
        index('.pager').find('a').find('span').each(function() {
            if (parseInt(index(this).text()) > 1) {
                totalPage = parseInt(index(this).text());
            }
        });

        for (let i = 1; i <= totalPage; i++) {
            const url = "http://wuhu.58.com/ershoufang/pn" + i;
            const body = await request(url);
            const loaded = cheerio.load(body);
            await spider(loaded);

            await Ut.sleep(60000);
            await setAverage();
        }

        async function setAverage() {
            const todayRes = await self.ctx.model.House.find({ crawlingDate })
            let sum = 0;
            if (todayRes.length) {
                for (let key in todayRes) {
                    sum += todayRes[key].price
                }
            }
            const aveRes = self.ctx.model.Average.find({ crawlingDate })
            if (aveRes.length) {
                if (aveRes[0].count < todayRes.length) {
                    await self.ctx.model.Average.update({
                        crawlingDate
                    }, {
                        $set: {
                            average: (sum / todayRes.length * 100) / 100,
                            count: todayRes.length,
                        }
                    })
                }
            } else {
                await self.ctx.model.Average.create({
                    average: (sum / todayRes.length * 100) / 100,
                    count: todayRes.length,
                    crawlingDate
                })
            }
        }

        async function spider(cheerio) {
            cheerio('.house-list-wrap').find('li').each(function() {
                let parms = {};
                const logr = cheerio(this).attr('logr');
                parms.id = logr.substr(0, logr.indexOf('_sortid')).split('_')[3];
                parms.logr = logr.substr(0, logr.indexOf('_sortid')).split('_')[2] + parms.id;

                parms.postdate = logr.substr(logr.indexOf('postdate') + 9, 13);
                parms.title = cheerio(this).find('.title').find('a').text().trim();

                const baseinfo = cheerio(this).find('.baseinfo');

                parms.type = baseinfo.eq(0).find('span').eq(0).text().replace(/\s+/g, '');
                parms.area = baseinfo.eq(0).find('span').eq(1).text().replace('㎡', '').trim();
                parms.towards = baseinfo.eq(0).find('span').eq(2).text().trim();
                parms.floor = baseinfo.eq(0).find('span').eq(3).text().trim();

                const baseinfoA = baseinfo.eq(1).find('a');
                if (baseinfoA.length >= 2) {
                    parms.community = baseinfoA.eq(0).text().trim();
                    parms.district = baseinfoA.eq(1).text().trim();
                } else if (baseinfoA.length == 1) {
                    parms.community = '';
                    parms.district = baseinfoA.eq(0).text().trim();
                }
                parms.agent = cheerio(this).find('.jjrname-outer').text().replace(/\s+/g, '');
                parms.company = cheerio(this).find('.jjrinfo').text().replace(/\s+/g, '_').split('_')[1].replace('－', '').trim();

                parms.price = cheerio(this).find('.price').find('.unit').text().replace('元/㎡', '').trim();
                addItem(parms);
            })

        }

        async function addItem(parms) {
            const HouseRes = await self.ctx.model.House.find({
                logr: parms.logr,
                crawlingDate
            });
            if (!HouseRes.length) {
                add(parms);
            } else {
                console.log(parms.id + ':有重复记录', parms.title);
            }
        }

        async function add(parms) {
            await self.ctx.model.House.create({
                logr: parms.logr,
                id: parms.id,
                title: parms.title,
                type: parms.type,
                area: parms.area,
                towards: parms.towards,
                floor: parms.floor,
                community: parms.community,
                district: parms.district,
                price: parms.price,
                total: parseInt(parms.area * parms.price) / 10000,
                postdate: parms.postdate,
                agent: parms.agent,
                company: parms.company,
                crawlingDate
            })
            console.log(parms.id + ':记录成功');
        }
    }
}

module.exports = Housing;