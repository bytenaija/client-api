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


module.exports = mongoose.model('ProductImage', ProductImageSchema)