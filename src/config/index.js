module.exports = {
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME || 'Ether Bank',
  NODE_ENV: process.env.NODE_ENV,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};
