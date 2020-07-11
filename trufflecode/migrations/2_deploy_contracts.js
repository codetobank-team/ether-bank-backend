var Nairacoin = artifacts.require("./Nairacoin.sol");

module.exports = function (deployer) {
  deployer.deploy(Nairacoin, 1000000);
};
