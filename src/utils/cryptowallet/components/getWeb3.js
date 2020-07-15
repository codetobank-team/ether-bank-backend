const Web3 = require("web3");

async function getWeb3() {
  new Promise((resolve, reject) => {
    try {
      const provider = new Web3.providers.HttpProvider(
        "https://ropsten.infura.io/v3/ac007c67256342a2930b2560d4987e42"
      );

      const web3 = new Web3(provider);
      console.log("No web3 instance injected, using Local web3.");
      resolve(web3);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = getWeb3;
