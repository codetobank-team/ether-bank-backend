/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
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
  transactionType: {
    type: String,
    enum: ['sent', 'received'],
  },
  amount: {
    type: String,
    required: true,
  },
  transactionStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
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
