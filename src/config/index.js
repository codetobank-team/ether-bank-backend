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
};
