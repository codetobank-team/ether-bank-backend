/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */


const Web3 = require('web3');
const Ethers = require('ethers');
const crypto = require('crypto');
const randomstring = require('randomstring');

const NairaCoin = require('../contract/build/contracts/Nairacoin.json');
const tokenABI = require('../contract/build/ethersabi/etherscontract.json');
const { CONTRACT_ADDRESS, CONTRACT_PRIVATE_KEY } = require('../config');
const { EthersProvider, Web3Provider } = require('./ethProvider');


const contractConnection = async (contractPrivateKey, contractAddress) => {
  contractPrivateKey = contractPrivateKey || CONTRACT_PRIVATE_KEY;
  contractAddress = contractAddress || CONTRACT_ADDRESS;
  const provider = await EthersProvider();
  const contractWallet = await new Ethers.Wallet(contractPrivateKey, provider);
  const contract = await new Ethers.Contract(contractAddress, tokenABI, provider);
  return contract.connect(contractWallet);
};

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

const sendToken = async (sender, recipient, amount, privateKey) => {
  const hash = crypto.createHash('sha256').update(randomstring.generate()).digest('hex');
  const timestamp = Date.now();  
  return {hash, timestamp};
}

module.exports = {
  contractConnection,
  createWallet,
  restoreWallet,
  addressBalance,
  sendToken,
};
