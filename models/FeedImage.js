const mongoose = require('mongoose');
let FeedImage = require('./FeedImage');

const Schema = mongoose.Schema;

const FeedImageSchema = new Schema({

    imageurl: {
        type: String,
        required: true,
    },


}, {
    timestamps: true
})


module.exports = mongoose.model('FeedImage', FeedImageSchema)