/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const Ethers = require('ethers');
const crypto = require('crypto');
const randomstring = require('randomstring');
const EthereumTx = require('ethereumjs-tx').Transaction;

// const NairaCoin = require('../contract/build/contracts/Nairacoin.json');

const { Web3Provider } = require('./ethProvider');
const tokenABI = require('../contract/build/ethersabi/etherscontract.json');
const { CONTRACT_ADDRESS, BLOCK_TX_CHAINID, BLOCK_TX_VALUE } = require('../config');

const web3Connection = (options = {}) => {
  const web3 = Web3Provider();
  return new web3.eth.Contract(tokenABI, CONTRACT_ADDRESS, options);
};

const createWallet = () => {
  const newWallet = Ethers.Wallet.createRandom();
  const { address, _isSigner } = newWallet;
  const { phrase, path, locale } = newWallet._mnemonic();
  const {
    curve, privateKey, publicKey, compressedPublicKey,
  } = newWallet._signingKey();
  return {
    address, phrase, privateKey, publicKey, compressedPublicKey, path, curve, locale, _isSigner,
  };
};

const restoreWallet = (mnemonic) => {
  const restoredWallet = Ethers.Wallet.fromMnemonic(mnemonic);
  const { address, _isSigner } = restoredWallet;
  const { phrase, path, locale } = restoredWallet._mnemonic();
  const {
    curve, privateKey, publicKey, compressedPublicKey,
  } = restoredWallet._signingKey();
  return {
    address, phrase, privateKey, publicKey, compressedPublicKey, path, curve, locale, _isSigner,
  };
};

const addressBalance = async (address) => {
  const web3 = Web3Provider();
  const contract = web3Connection();
  const balance = await contract.methods.balanceOf(address).call();
  const balanceInEthers = web3.utils.fromWei(balance, 'ether');
  return balanceInEthers;
};

const sendToken = async (sender, recipient, amount, privateKey, callback) => {
  const hash = crypto.createHash('sha256').update(randomstring.generate()).digest('hex');
  const timestamp = Date.now();
  return { hash, timestamp };

  /*
  * Blockchain implementation
  const web3 = Web3Provider();
  const addressTxCount = await web3.eth.getTransactionCount(sender);
  const contract = await web3Connection({ from: sender });
  const rawTransaction = {
    from: sender,
    nonce: `0x${addressTxCount.toString(16)}`,
    gasPrice: web3.utils.toHex(web3.eth.gasPrice),
    gasLimit: web3.utils.toHex(90000),
    to: CONTRACT_ADDRESS,
    value: BLOCK_TX_VALUE,
    data: contract.methods.transfer(recipient, web3.utils.toWei(amount, 'ether')).encodeABI(),
    chainId: BLOCK_TX_CHAINID,
  };
  const bufferedPrivateKey = Buffer.from(privateKey, 'hex');
  const serializedTx = (new EthereumTx(rawTransaction)).sign(bufferedPrivateKey).serialize();
  return web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, callback || null);
  */
};

const getContractTransactions = async () => {
  const contract = web3Connection({ from: CONTRACT_ADDRESS });
  const contractTxHistory = await contract.getPastEvents('Transfer', {
    fromBlock: 0,
    toBloack: 'latest',
  });
  return contractTxHistory;
};

const getAddressSentTransactions = async (address) => {
  const contract = web3Connection();
  const sentTxHistory = await contract.getPastEvents('Transfer', {
    filter: { from: address },
    fromBlock: 0,
  });
  return sentTxHistory;
};

const getAddressReceivedTransactions = async (address) => {
  const contract = web3Connection();
  const sentTxHistory = await contract.getPastEvents('Transfer', {
    filter: { from: address },
    fromBlock: 0,
  });
  return sentTxHistory;
};

const getAddressTransactions = async (address) => {
  const contract = web3Connection();
  const sentTxHistory = await contract.getPastEvents('Transfer', {
    filter: { from: address, to: address },
    fromBlock: 0,
  });
  return sentTxHistory;
};

getContractTransactions();
module.exports = {
  createWallet,
  restoreWallet,
  addressBalance,
  sendToken,
  getContractTransactions,
  getAddressSentTransactions,
  getAddressReceivedTransactions,
  getAddressTransactions,
};
