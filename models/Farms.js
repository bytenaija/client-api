const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const moment = require('moment')

const Schema = mongoose.Schema;

const FarmSchema = new Schema({
    numberOfGoats: {
        type: Number,
        required: true,
    },
    profitPercent: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    amountInvested: {
        type: Number,
        required: true,
    },
    dateOfROI: {
        type: mongoose.SchemaTypes.Date,
        required: true,
    },

    status:{
        type:String,
        required: true,
        default: 'unpaid'
    },

    reference:{
        type:String,
        required: true
    },

}, {
    timestamps: true
})

FarmSchema.pre('save', function (next) {
    this.dateOfROI = moment().add(6, 'months').toISOString()
    next()
});



module.exports =  mongoose.model('Farm', FarmSchema)