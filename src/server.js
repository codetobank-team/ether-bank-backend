require('dotenv').config();
const app = require('./expressApp');
const { PORT, APP_NAME } = require('./config');

const horizontalLine = '\n--------------------------------------------------\n';

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${horizontalLine}${APP_NAME} is listening on port ${PORT}...${horizontalLine}`);
});
