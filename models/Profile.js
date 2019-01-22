const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    address: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,

    },

    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    profilePic: {
        type: String,
        required: false,

    },

    profession: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
})



module.exports = mongoose.model('Profile', ProfileSchema)