module.exports = app => {
    const mongoose = app.mongoose;
    const JobSchema = new mongoose.Schema({
        name: { type: String },
        count: { type: Number },
        time: { type: String },
    });

    return mongoose.model('Job', JobSchema);
}