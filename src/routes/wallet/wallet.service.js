const { Wallet } = require('../../database/models');
const {
  logger, blockUtils: { createWallet, addressBalance },
  accountNumber: { generate }, cryptoUtils: { encrypt },
} = require('../../utils');

const WalletServiceLogger = logger(module);

const findWalletByAddressOrAccountNumber = async (data) => Wallet.findOne({
  $or: [{ address: data }, { accountNumber: data }],
}).exec();

const findUserWallet = async (userId) => Wallet.findOne({ userId }).exec();

const createUserWallet = async (userId, userPin) => {
  let wallet = await findUserWallet(userId);
  if (!wallet) {
    const { address, privateKey } = createWallet();
    const accountNumber = (await generate()).toString();
    const safePrivateKey = encrypt(privateKey, userPin);
    try {
      wallet = new Wallet({
        userId, accountNumber, address, privateKey: safePrivateKey,
      }).save();
      WalletServiceLogger.log('info', `Wallet created: ${wallet.address}`);
    } catch (error) {
      WalletServiceLogger.log('error', `Error creating user wallet: ${userId}`);
      wallet = null;
    }
  }
  return wallet;
};

const getAddressBalance = (address) => addressBalance(address);

module.exports = {
  findUserWallet, createUserWallet, findWalletByAddressOrAccountNumber, getAddressBalance,
};
