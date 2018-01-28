module.exports = app => {
    const mongoose = app.mongoose;
    const AverageSchema = new mongoose.Schema({
        average: { type: Number },
        count: { type: Number },
        crawlingDate: { type: String },
    });

    return mongoose.model('Average', AverageSchema);
}