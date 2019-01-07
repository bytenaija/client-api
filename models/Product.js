const mongoose = require('mongoose');
let ProductImage = require('./ProductImage');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    stock: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    images:[{ type: Schema.Types.ObjectId, ref: 'ProductImage' }]
}, {
    timestamps: true
})

ProductSchema.pre('remove', function(next) {
    ProductImage.remove({productId: this._id}).exec();
    next();
});

module.exports =  mongoose.model('Product', ProductSchema)