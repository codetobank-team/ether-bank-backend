const validator = require('validator');

const isEthereumAddress = (address) => validator.isEthereumAddress(address.toString());

const isMongoObjectId = (id) => validator.isMongoId(id);

const isAccountNumber = (accountNumber) => 
  validator.isNumeric(accountNumber) || validator.isLength(accountNumber.toString(), {min: 10});


module.exports = {isEthereumAddress, isMongoObjectId, isAccountNumber };