const redis = require('redis');
const { promisify } = require('util');
const { REDIS_HOST, REDIS_PORT } = require('../config');

const client = redis.createClient(REDIS_PORT, REDIS_HOST);

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

module.exports = {
  getAsync,
  setAsync,
  delAsync,
};
