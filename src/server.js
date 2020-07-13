require('dotenv').config();
const app = require('./expressApp');
const mongooseConnect = require('./database/connect');
const { logger } = require('./utils');
const {
  PORT,
  APP_NAME,
  MONGO_HOST,
  MONGO_PORT,
} = require('./config');

const horizontalLine = '\n--------------------------------------------------\n';

const serverLogger = logger(module);

/* eslint-disable no-console */
mongooseConnect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/ether_bank`).then(() => {
  app.listen(PORT, () => {
    console.log(`${horizontalLine}${APP_NAME} is listening on port ${PORT}${horizontalLine}`);
    serverLogger.log('info', 'Server started');
  });
}).catch((err) => console.log('Error connecting to MongoDB: ', err));
