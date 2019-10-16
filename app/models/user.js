const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Deck = require('./deck');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
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
  decks: [{
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }]
});

// userSchema.pre('save', function (next) {
//   var user = this;
//   if (!user.isModified('password')) {
//     return next();
//   }

//   bcrypt.hash(user.password, null, null, function (error, hash) {
//     if (error) {
//       return next(error);
//     }
//     user.password = hash;
//     next();
//   });
// });

// userSchema.methods.comparePassword = function (password) {
//   var user = this;
//   return bcrypt.compareSync(password, user.password);
// };

module.exports = mongoose.model('User', userSchema);