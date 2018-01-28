module.exports = app => {
    const mongoose = app.mongoose;
    const AverageSchema = new mongoose.Schema({
        average: { type: String },
        crawlingDate: { type: String },
    });

    return mongoose.model('Average', AverageSchema);
}