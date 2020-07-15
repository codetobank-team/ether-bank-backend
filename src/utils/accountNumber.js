const randomstring = require('randomstring');

const generate = async () => randomstring.generate({
  length: 10,
  charset: 'numeric',
});

module.exports = { generate };
