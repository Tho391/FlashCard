const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let deckSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  public: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }
});

module.exports = mongoose.model('Deck', deckSchema);