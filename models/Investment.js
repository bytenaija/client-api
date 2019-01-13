const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const InvestmentSchema = new Schema({
    minNumberOfGoats: {
        type: Number,
        required: true,
    },

    maxNumberOfGoats: {
        type: Number,
        required: true,
    },

    minAmount: {
        type: Number,
        required: true,
    },
    maxAmount: {
        type: Number,
        required: true,
    },
    profitPercent: {
        type: Number,
        required: true,
    },

    status:{
        type:String,
        required: true,
        default: 'inActive'
    },

    unitPrice: {
        type: Number,
        required: true,
    }

}, {
    timestamps: true
})



module.exports = Investment = mongoose.model('investments', InvestmentSchema)