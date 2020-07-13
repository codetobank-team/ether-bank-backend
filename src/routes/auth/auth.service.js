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

  await user.save();
};

const findUser = (email) => User.findOne({ email }).exec();

module.exports = {
  saveUser,
  findUser,
};
