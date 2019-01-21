const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    numberOfGoats: {
        type: Number,
        required: true,
    },
 
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    months: {
        type: Number,
        required: true,
        default: 6
    },

    goatUnitPrice: {
        type: Number,
        required: true,
        default: 20000
    },

    vaccinationUnitPrice: {
        type: Number,
        required: true,
        default: 1000
    },

    feedingUnitPrice: {
        type: Number,
        required: true,
        default: 2000
    },

    labourUnitPrice: {
        type: Number,
        required: true,
        default: 2000
    },
   
    amountInvested: {
        type: Number,
        required: true,
    },

    reference:{
        type:String,
        required: true
    },

}, {
    timestamps: true
})

// InvoiceSchema.pre('save', function (next) {
//     this.amountInvested = this.numberOfGoats + (this.labourUnitPrice * this.numberOfGoats * this.)
//     next()
// });

// InvoiceSchema.pre('create', function (next) {
   
//     next()
// });



module.exports =  mongoose.model('Invoice', InvoiceSchema)