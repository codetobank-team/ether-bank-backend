const { Transaction } = require('../../database/models');

const saveTransaction = async ({
  senderId,
  receiverId,
  hash,
  transactionType,
  amount,
  transactionStatus,
}) => {
  const transaction = new Transaction({
    senderId,
    receiverId,
    hash,
    transactionType,
    amount,
    transactionStatus,
  });
  const newTransaction = await transaction.save();

  return newTransaction;
};

const findTransaction = (transactionId) => Transaction.findOne({ _id: transactionId }).exec();

module.exports = {
  saveTransaction,
  findTransaction,
};
