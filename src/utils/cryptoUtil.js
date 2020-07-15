/* eslint-disable max-len */
const cryptoJS = require('crypto-js');

const encrypt = (text, userSecret) => cryptoJS.AES.encrypt(text, userSecret).toString();

const decrypt = (cipherText, userSecret) => cryptoJS.AES.decrypt(cipherText, userSecret).toString(cryptoJS.enc.Utf8);

module.exports = {
  encrypt,
  decrypt,
};
