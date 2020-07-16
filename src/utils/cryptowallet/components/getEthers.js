const ethers = require('ethers'); // ... to get Ethers Connection

async function getEthers() {
  new Promise((resolve, reject) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://ropsten.infura.io/v3/ac007c67256342a2930b2560d4987e42',
      );

      console.log('Ethers Lib connection');
      resolve(provider);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = getEthers;
