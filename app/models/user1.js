//grab the packages that we need for the user model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Deck = require('./deck');
var bcrypt = require('bcrypt-nodejs');
//use schema
const userSchema = new Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    permission: String,
    avatar: {
        data: Buffer,
        contentType: String,
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
});
//return the model
module.exports = mongoose.model('User', userSchema);