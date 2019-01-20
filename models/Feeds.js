const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const FeedsSchema = new Schema({
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes: {
        type: Number,
        required: true,
        default: 0
    },

    likedBy: [{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }],

    dislikedBy: [{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }],
    
    favourites: {
        type: Number,
        required: true,
        default: 0
    },

    favouritedBy: [{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }],

    image: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: 'FeedImage'
    },

    description: {
        type: String,
        required: true,
       
    }
}, {
    timestamps: true
})



module.exports =  mongoose.model('Feed', FeedsSchema)