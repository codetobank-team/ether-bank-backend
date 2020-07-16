const authRouter = require('./auth');
const userRouter = require('./user');
const walletRouter = require('./wallet');
const transactionRouter = require('./transaction');

module.exports = {
  authRouter,
  userRouter,
  walletRouter,
  transactionRouter,
};
