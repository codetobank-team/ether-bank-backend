/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const {
  bcryptUtils: { hash, compare },
} = require('../../utils');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  transactionPin: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.transactionPin;
    },
  },
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await hash(user.password);
  }

  if (user.isModified('transactionPin')) {
    user.transactionPin = await hash(user.transactionPin);
  }

  next();
});

userSchema.methods.comparePassword = async function (inputPassword) {
  const result = await compare(inputPassword, this.password);
  return result;
};

userSchema.methods.compareTransactionPin = async function (inputPin) {
  const result = await compare(inputPin, this.pin);
  return result;
};

module.exports = mongoose.model('User', userSchema);
