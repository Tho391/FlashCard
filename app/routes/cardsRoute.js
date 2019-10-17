const mongoose = require('mongoose');
const SECRET = require('../../config/env').secret;
const jwt = require('jsonwebtoken');
const Deck = require('../models/deck');
const Card = require('../models/card');
const User = require('../models/user');

module.exports = function (apiRouter) {
  apiRouter.route('/cards')
    // POST /api/cards
    .post(function (req, res) {
      let card = new Card({
        front: req.body.front,
        back: req.body.back,
        deck: req.body.deckId
      });

      card.save(function (err) {
        if (err) {
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: 'The front already exists'
            });
          } else {
            throw err;
          }
        }

        res.json({
          success: true,
          message: 'Created Successfully'
        });
      });
    });

  apiRouter.route('/cards/:cardId')
    // GET /api/cards/:cardId
    .get(function (req, res) {
      Card.findById(req.params.cardId).populate('deck').exec(function (err, card) {
        if (err) {
          throw err;
        }

        res.json(card);
      });
    })
    // PUT /api/cards/:cardId
    .put(function(req, res) {
      Card.findById(req.params.cardId, function(err, card) {
        if (err) {
          throw err;
        }

        if (req.body.front) {
          card.front = req.body.front;
        }
        if (req.body.back) {
          card.back = req.body.back;
        }

        card.save(function(err) {
          if (err) {
            if (err.code == 11000) {
              return res.json({
                success: false,
                message: 'The front already exists'
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
    // DELETE /api/cards/:cardId
    .delete(function(req, res) {
      Card.remove({ _id: req.params.cardId }, function(err) {
        if (err) {
          throw err;
        }

        res.json({
          success: true,
          message: 'Deleted Successfully'
        });
      });
    });
}