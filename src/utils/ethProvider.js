const Ethers = require('ethers');
const Web3 = require('web3');

const { INFURA_API_URL, INFURA_TOKEN, BLOCKCHAIN_PROVIDER } = require('../config');

const blockProvider = BLOCKCHAIN_PROVIDER || `${INFURA_API_URL + INFURA_TOKEN}`;

const EthersProvider = () => new Ethers.providers.JsonRpcProvider(blockProvider);

const Web3Provider = () => new Web3.providers.HttpProvider(blockProvider);

module.exports = { EthersProvider, Web3Provider };
