const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Card = require('./card');

let deckSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: String,
  private: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Deck', deckSchema);