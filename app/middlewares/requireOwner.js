const Deck = require('../models/deck');
const Card = require('../models/card');

module.exports = (req, res, next) => {
  console.log('requireSamePerson');
  console.log(res.user);

  if (req.user.permission === 'user') {
    let deckId = req.params.deckId || req.body.deckId;

    if (!deckId) {
      deck = Card.findById(req.params.cardId).select('deck');
    } 

    Deck.findById(deckId).select('owner public').exec(function (err, deck) {
      if (req.user._id != deck.owner && !deck.public) {
        return res.status(403).json({ message: 'Access denied' });
      }
    });
  }
  next();
};