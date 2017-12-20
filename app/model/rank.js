module.exports = app => {
    const mongoose = app.mongoose;
    const RankSchema = new mongoose.Schema({
        name: { type: String },
        rank: { type: Number },
        month: { type: String },
    });

    return mongoose.model('Rank', RankSchema);
}