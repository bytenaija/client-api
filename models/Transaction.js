const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  
  from: {
    type: String,
    required: true
  },

  to: {
    type: String,
    required: true   
  },

  amount:{
    type: Number,
    required: true
  },

  email: {
    type: String,
    required: true  
  }  

}, {
  timestamps: true
})



module.exports = mongoose.model('Transaction', TransactionSchema)