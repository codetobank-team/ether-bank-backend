const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');
const { APP_NAME } = require('./config');

const app = express();

app.use(express.json({ limit: '124kb' }));
app.use(express.urlencoded({ extended: false, limit: '124kb' }));
app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'You have exceeded the 300 requests in 15 mins limit.',
  headers: true,
}));

app.get('/', (_, res) => res.status(200).json({
  status: 200,
  message: `The ${APP_NAME} API is alive!!!`,
}));

// TODO: set up express routes here

app.use((_, res) => res.status(404).json({
  status: 404,
  message: 'Check the URL and try again.',
}));

module.exports = app;
