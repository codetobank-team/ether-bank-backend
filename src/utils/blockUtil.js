/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const Ethers = require('ethers');
const Web3 = require('web3');
const NairaCoin = require('../contract/build/contracts/Nairacoin.json');
const ContractAbi = require('../contract/build/ethersabi/etherscontract.json');
const { CONTRACT_ADDRESS, CONTRACT_PRIVATE_KEY } = require('../config');
const { EthersProvider, Web3Provider } = require('./ethProvider.js');

const contractConnection = async (contractPrivateKey, contractAddress) => {
  contractPrivateKey = contractPrivateKey || CONTRACT_PRIVATE_KEY;
  contractAddress = contractAddress || CONTRACT_ADDRESS;
  const provider = await EthersProvider();
  const contractWallet = await new Ethers.Wallet(contractPrivateKey, provider);
  const contract = await new Ethers.Contract(contractAddress, ContractAbi, provider);
  return contract.connect(contractWallet);
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
  const connection = await contractConnection();
  const balanceInWei = connection.balanceOf(address);
  return Web3.utils.fromWei(balanceInWei.toString(), 'ether');
};

module.exports = {
  contractConnection,
  createWallet,
  restoreWallet,
  addressBalance,
};
