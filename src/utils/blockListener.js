/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const Ethers = require("ethers");
const Web3 = require("web3");
const NairaCoin = require("../contract/build/contracts/Nairacoin.json");
const tokenABI = require("../contract/build/ethersabi/etherscontract.json");
const { CONTRACT_ADDRESS, CONTRACT_PRIVATE_KEY } = require("../config");
const { EthersProvider, Web3Provider } = require("./ethProvider.js");

const web3Connection = (from) => {
  from = from || CONTRACT_ADDRESS;
  const web3 = Web3Provider();
  return new web3.eth.Contract(tokenABI, CONTRACT_ADDRESS, { from });
};

const getTransactionHistory = async (address) => {
  const contract = web3Connection(address);
  const transactionHistoryArray = await contract.getPastEvents("Transfer", {
    filter: { from: address },
    fromBlock: 0,
    toBloack: "lastest",
  });

  console.log(transactionHistoryArray);

  return transactionHistoryArray;
};

module.exports = getTransactionHistory;
