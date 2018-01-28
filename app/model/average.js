module.exports = app => {
    const mongoose = app.mongoose;
    const HouseSchema = new mongoose.Schema({
        average: { type: String },
        crawlingDate: { type: String },
    });

    return mongoose.model('House', HouseSchema);
}