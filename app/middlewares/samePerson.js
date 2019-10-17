const Deck = require('../models/deck');

module.exports = function (req, res, next) {

  if (req.decoded.permission === 'user') {
    Deck.findById(req.params.deckId).select('owner private').exec(function (err, deck) {
      console.log(deck);
      if (req.decoded.id != deck.owner && deck.private) {
        return res.status(403).json({ message: 'Access denied' });
      }
    });
  }
  next();
};