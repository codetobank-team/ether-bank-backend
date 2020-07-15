/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const { cryptoUtils: { decrypt } } = require('../../utils');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

// walletSchema.pre('save', async function (next) {
//   next();
// });

walletSchema.methods.toJSON = function () {
  const walletObject = this.toObject();
  delete walletObject.privateKey;
  return walletObject;
};

walletSchema.methods.decryptPrivateKey = async function (inputPin) {
  return decrypt(this.privateKey, inputPin);
};

module.exports = mongoose.model('Wallet', walletSchema);
