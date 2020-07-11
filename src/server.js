require('dotenv').config();
const app = require('./expressApp');
const { PORT, APP_NAME } = require('./config');
const { logger } = require('./utils');

const horizontalLine = '\n--------------------------------------------------\n';

const serverLogger = logger(module);
serverLogger.log('info', 'Server started');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${horizontalLine}${APP_NAME} is listening on port ${PORT}...${horizontalLine}`);
});
