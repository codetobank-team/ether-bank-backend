const { Transaction } = require('../../database/models');
const { validatorUtils: { isMongoObjectId } } = require('../../utils');

const saveTransaction = async (data) => {
  const transaction = new Transaction(data);
  const newTransaction = await transaction.save();
  return newTransaction;
};

const findTransaction = (ref) => {
  const searchContraint = !isMongoObjectId(ref) ? { hash: ref }
    : { $or: [{ _id: ref }, { hash: ref }] };
  return Transaction.findOne(searchContraint).exec();
};

const findWalletTransactions = (wallet) => Transaction.find({
  $or: [
    { sender: wallet.address },
    { sender: wallet.accountNumber },
    { recipient: wallet.address },
    { recipient: wallet.accountNumber },
  ],
}).exec();

const findWalletReceivedTransactions = (wallet) => Transaction.find({
  $or: [
    { recipient: wallet.address },
    { recipient: wallet.accountNumber },
  ],
}).exec();

const findWalletSentTransactions = (wallet) => Transaction.find({
  $or: [
    { sender: wallet.address },
    { sender: wallet.accountNumber },
  ],
}).exec();

module.exports = {
  saveTransaction,
  findTransaction,
  findWalletTransactions,
  findWalletReceivedTransactions,
  findWalletSentTransactions,
};
