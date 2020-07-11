// var HDWalletProvider = require("truffle-hdwallet-provider");
// const MNEMONIC =
//   "dream earth faculty hawk cost essay stable consider item fee habit nerve";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000,
    },

    // Settings to deploy Contract to the Ropsten
    ropsten: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/ac007c67256342a2930b2560d4987e42");
      },
      network_id: 3,
      gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
    },
  },

  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200, // Default: 200
        },
      },
    },
  },
};
