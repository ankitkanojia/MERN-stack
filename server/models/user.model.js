const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 5 },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 5 },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {
    timestamps: true
});

const user = mongoose.model('User', userSchema);

module.exports = user;