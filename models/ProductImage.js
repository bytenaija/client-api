const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductImageSchema = new Schema({

    imageurl: {
        type: String,
        required: true,
    },


}, {
    timestamps: true
})


module.exports = ProductImage = mongoose.model('productimages', ProductImageSchema)