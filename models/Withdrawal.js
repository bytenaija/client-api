const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const WithdrawalSchema = new Schema({
   
    accountName: {
        type: String,
        required: true,
    },

    bankName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,

    },

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    farmDue: [{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Farm'
    }],

    amountToWithdraw:    {
        type: Number,
        required: true,

    },
}, {
    timestamps: true
})



module.exports = mongoose.model('Withdrawal', WithdrawalSchema)