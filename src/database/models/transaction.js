const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  hash: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['SENT', 'RECEIVED'],
  },
  amount: {
    type: String,
    required: true,
  },
  transactionStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
