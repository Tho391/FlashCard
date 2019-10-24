const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    select: false
  },
  email: String,
  avatar: {
    data: Buffer,
    contentType: String,
  },
  permission: {
    type: String,
    default: 'user'
  },
  googleId: String
});

userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, null, null, function (error, hash) {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', userSchema);