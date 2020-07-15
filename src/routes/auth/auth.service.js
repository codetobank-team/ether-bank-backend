const { User } = require('../../database/models');

const saveUser = async ({
  firstName,
  lastName,
  email,
  password,
  transactionPin,
}) => {
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    transactionPin,
  });
  const newUser = await user.save();

  return newUser;
};

const findUser = (email) => User.findOne({ email }).exec();

const findUserById = (_id) => User.findOne({ _id }).exec();

module.exports = {
  saveUser,
  findUser,
  findUserById,
};
