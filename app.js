// app.js
module.exports = app => {
    app.beforeStart(async() => {
        console.log('beforeStart');
    });
    app.runSchedule('jobSpider');
};