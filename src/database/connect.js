const mongoose = require('mongoose');

module.exports = (url) => mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});
