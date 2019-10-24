const mongoose = require('mongoose');
const keys = require('../../config/key');

let count = 0;

module.exports.connect = function() {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
      console.log('Connect to database successfully');
    })
    .catch((err) => {
      console.log(`Cannot connect to database. Try connecting after 5 seconds (${++count})`);
      setTimeout(arguments.callee, 5000);
    });
};