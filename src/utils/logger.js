const { createLogger, format, transports } = require('winston');
const path = require('path');

const {
  combine,
  timestamp,
  label,
  prettyPrint,
} = format;

const getLogLabel = (callingModule) => {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

const logger = (callingModule) => createLogger({
  format: combine(
    label({ label: getLogLabel(callingModule) }),
    timestamp(),
    prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/trace.log' }),
  ],
  exitOnError: false,
});

module.exports = logger;
