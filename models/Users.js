const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    names: {
        type: String,
        require: true,
        trim: true
    },
    surnames: {
        type: String,
        require: true,
        trim: true

    },
    birthdate: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    avatar: {
        type: String,
        trim: true,
        default: ''
    },
    banner: {
        type: String,
        trim: true,
        default: ''
    },
    biography: {
        type: String,
        trim: true,
        default: ''
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    website: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);