/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    type: String,
    ref: 'Wallet',
  },
  recipient: {
    type: String,
    ref: 'Wallet',
  },
  hash: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
  blockchainTimestamp: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
