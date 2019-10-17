const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Card = require('./card');

let deckSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  private: {
    type: Boolean,
    default: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  // cards: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Card'
  // }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// deckSchema.virtual('totalCards').get(function() {
//   return this.cards.length;
// });

module.exports = mongoose.model('Deck', deckSchema);