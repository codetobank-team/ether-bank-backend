module.exports = {
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME || 'Ether Bank',
  NODE_ENV: process.env.NODE_ENV,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  ATLAS_DB_NAME: process.env.ATLAS_DB_NAME,
  ATLAS_PASSWORD: process.env.ATLAS_PASSWORD,
  INFURA_API_URL: process.env.INFURA_API_URL,
  INFURA_TOKEN: process.env.INFURA_TOKEN,
  INFURA_SECRET: process.env.INFURA_SECRET,
  BLOCKCHAIN_PROVIDER: process.env.BLOCKCHAIN_PROVIDER || null,
  CONTRACT_PRIVATE_KEY: process.env.CONTRACT_PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  BLOCK_TX_VALUE: process.env.BLOCK_TX_VALUE || '0x0',
  BLOCK_TX_CHAINID: process.env.BLOCK_TX_CHAINID || '0x03',
};
