module.exports = app => {
    const mongoose = app.mongoose;
    const HouseSchema = new mongoose.Schema({
        logr: { type: String },
        id: { type: String },
        title: { type: String },
        type: { type: String },
        area: { type: Number },
        towards: { type: String },
        floor: { type: String },
        community: { type: String },
        district: { type: String },
        price: { type: Number },
        total: { type: Number },
        postdate: { type: String },
        agent: { type: String },
        company: { type: String },
        crawlingDate: { type: String },
    });

    return mongoose.model('House', HouseSchema);
}