/* eslint-disable no-nested-ternary */
require('dotenv').config();
const app = require('./expressApp');
const mongooseConnect = require('./database/connect');
const { logger } = require('./utils');
const {
  NODE_ENV,
  PORT,
  APP_NAME,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB_NAME,
  ATLAS_DB_NAME,
  ATLAS_PASSWORD,
} = require('./config');

const horizontalLine = '\n--------------------------------------------------\n';
const serverLogger = logger(module);

const connectionUrl = NODE_ENV === 'development'
  ? `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`
  : NODE_ENV === 'stage'
    ? `mongodb+srv://ether-dev-db:${ATLAS_PASSWORD}@etherbank-dev-db.75jle.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`
    : `mongodb+srv://ether-prod-user:${ATLAS_PASSWORD}@etherbank-prod.e1lan.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`;

/* eslint-disable no-console */
mongooseConnect(connectionUrl)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `${horizontalLine}${APP_NAME} is listening on port ${PORT}${horizontalLine}`,
      );
      serverLogger.log('info', 'Server started');
    });
  })
  .catch((err) => console.log('Error connecting to MongoDB: ', err));
