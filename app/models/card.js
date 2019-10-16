const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Deck = require('./deck');

let cardSchema = new Schema({
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  deck: {
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }
});

module.exports = mongoose.model('Card', cardSchema);