const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AmountLoggerSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },

  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  },

}, {
  timestamps: true
})


module.exports = mongoose.model('AmountLogger', AmountLoggerSchema)