const Deck = require('../models/deck');
const Card = require('../models/card');
const User = require('../models/user');
const requireSameOwner = require('../middlewares/requireOwner');
const requireAuthentication = require('../middlewares/requireAuthentication');

module.exports = function (apiRouter) {
  apiRouter.route('/decks')
    // POST /api/decks
    .post([requireAuthentication], function (req, res) {
      User.findById(req.user._id, function (err, user) {
        if (err) {
          throw err;
        }

        let deck = new Deck({
          name: req.body.name,
          description: req.body.description,
          owner: user._id,
          author: user._id
        });

        deck.save(function (err, product) {
          if (err) {
            if (err.code == 11000) {
              return res.json({
                success: false,
                message: 'The deck name already exists'
              });
            } else {
              throw err;
            }
          }

          res.json({
            success: true,
            message: 'Created Successfully',
            id: product._id
          })
        });
      });
    })
    // GET /api/decks
    .get([
      requireAuthentication,
      requireSameOwner
    ], function (req, res) {
      Deck.find({ owner: req.user._id }).lean().exec(async function (err, decks) {
        if (err) {
          throw err;
        }

        for (let i = 0; i < decks.length; i++) {
          decks[i].totalCards = await Card.countDocuments({ deck: decks[i]._id });
        }

        res.json(decks);
      });
    });

  apiRouter.route('/decks/:deckId')
    // GET /api/decks/:deckId
    .get([
      requireAuthentication,
      requireSameOwner
    ], function (req, res) {
      Deck.findById(req.params.deckId).lean().exec(async function (err, deck) {
        if (err) {
          throw err;
        }

        if (deck != null) {
          deck.cards = await Card.find({ deck: req.params.deckId });
        }

        res.json(deck);
      });
    })
    // PUT /api/decks/:deckId
    .put([
      requireAuthentication,
      requireSameOwner
    ], function (req, res) {
      Deck.findById(req.params.deckId, function (err, deck) {
        if (err) {
          throw err;
        }

        if (req.body.name) {
          deck.name = req.body.name;
        }
        if (req.body.description) {
          deck.description = req.body.description;
        }

        deck.save(function (err) {
          if (err) {
            if (err.code == 11000) {
              return res.json({
                success: false,
                message: 'The deck name already exists'
              });
            } else {
              throw err;
            }
          }

          res.json({
            success: true,
            message: 'Updated Successfully'
          });
        });
      });
    })
    // DELETE /api/decks/:deckId
    .delete([
      requireAuthentication,
      requireSameOwner
    ], function (req, res) {
      Deck.remove({ _id: req.params.deckId }, function (err) {
        if (err) {
          throw err;
        }

        res.json({
          success: true,
          message: 'Deleted Successfully'
        });
      });
    });
};