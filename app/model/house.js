module.exports = app => {
    const mongoose = app.mongoose;
    const HouseSchema = new mongoose.Schema({
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
        time: { type: String },
        postdate: { type: String },
    });

    return mongoose.model('House', HouseSchema);
}