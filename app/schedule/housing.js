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
        const thisDate = new Date().setHours(0, 0, 0, 0) + "";
        const self = this;
        let totalPage = 1;
        const indexBody = await request("http://wuhu.58.com/ershoufang/");
        const index = cheerio.load(indexBody);
        index('.pager').find('a').find('span').each(function() {
            if (parseInt(index(this).text()) > 1) {
                totalPage = parseInt(index(this).text());
            }
        });
        console.log('totalPage: ', totalPage);

        for (let i = 1; i <= totalPage; i++) {
            const url = "http://wuhu.58.com/ershoufang/pn" + i;
            const body = await request(url);
            const loaded = cheerio.load(body);
            await spider(loaded);
            await Ut.sleep(10000);
        }

        async function spider(cheerio) {
            cheerio('.house-list-wrap').find('li').each(function() {
                const logr = cheerio(this).attr('logr');
                const id = logr.substr(0, logr.indexOf('_sortid')).split('_')[3];
                const postdate = logr.substr(logr.indexOf('postdate') + 9, 13);
                const title = cheerio(this).find('.title').find('a').text().trim();

                const baseinfo = cheerio(this).find('.baseinfo');
                const type = baseinfo.eq(0).find('span').eq(0).text().replace(/\s+/g, '');
                const area = baseinfo.eq(0).find('span').eq(1).text().replace('㎡', '').trim();
                const towards = baseinfo.eq(0).find('span').eq(2).text().trim();
                const floor = baseinfo.eq(0).find('span').eq(3).text().trim();

                const baseinfoA = baseinfo.eq(1).find('a');
                let community = '';
                let district = '';
                if (baseinfoA.length >= 2) {
                    community = baseinfoA.eq(0).text().trim();
                    district = baseinfoA.eq(1).text().trim();
                } else if (baseinfoA.length == 1) {
                    district = baseinfoA.eq(0).text().trim();
                }
                const jjr = cheerio(this).find('.jjrname-outer').text().replace(/\s+/g, '');
                // console.log('jjr: ', jjr);
                const price = cheerio(this).find('.price').find('.unit').text().replace('元/㎡', '').trim();
                // console.log('id: ', id);
                // console.log('标题: ', title);
                // console.log('户型: ', type);
                // console.log('面积: ', area + '㎡');
                // console.log('朝向: ', towards);
                // console.log('楼层:', floor);
                // console.log('小区: ', community);
                // console.log('区县: ', district);
                // console.log('平方价: ', price + '元/㎡');
                // console.log('总价', parseInt(area * price) / 10000 + '万元');
                addItem(id, title, type, area, towards, floor, community, district, price, postdate);
            })

        }

        async function addItem(id, title, type, area, towards, floor, community, district, price, postdate) {
            const HouseRes = await self.ctx.model.House.find({ time: thisDate, id });

            if (!HouseRes.length) {
                const res = await self.ctx.model.House.create({
                    id,
                    title,
                    type,
                    area,
                    towards,
                    floor,
                    community,
                    district,
                    price,
                    total: parseInt(area * price) / 10000,
                    time: thisDate,
                    postdate
                })
                console.log(id + ':记录成功');
            } else {
                console.log(id + ':有重复记录');
            }
        }
        // const length = await this.ctx.model.House.find({});
        // console.log('length: ', length.length);
    }
}

module.exports = Housing;