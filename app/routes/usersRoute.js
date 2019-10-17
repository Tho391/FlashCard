const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.createUserRoute = function (apiRouter) {
  apiRouter.route('/users')
    // POST /api/users
    .post(function (req, res) {
      let user = new User();
      // user._id = new mongoose.Types.ObjectId();
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function (error) {
        if (error) {
          if (error.code == 11000) {
            return res.json({
              success: false,
              message: 'The username already exists!'
            });
          } else {
            return res.send(error);
          }
        }

        return res.json({
          success: true,
          message: 'Created successfully!'
        });
      });
    })
};

module.exports.manipulateUserRoute = function (apiRouter) {
  apiRouter.get('/', function (req, res) {
    res.json({ message: 'Hooray! Welcome to our api!' });
  });

  apiRouter.route('/users')
    // GET /api/users
    .get(function (req, res) {
      User.find(function (error, users) {
        if (error) {
          return res.send(error);
        }
        res.json(users);
      });
    });

  apiRouter.route('/users/:user_id')
    // GET /api/users/:user_id
    .get(function (req, res) {
      User.findById(req.params.user_id, function (err, user) {
        if (err) {
          return res.send(err);
        }
        res.json(user);
      });
    })
    // PUT /api/users/:user_id
    .put(function (req, res) {
      User.findById(req.params.user_id, function (err, user) {
        if (err) {
          return res.send(err);
        }

        if (req.body.name) {
          user.name = req.body.name;
        }
        if (req.body.username) {
          user.username = req.body.username;
        }
        if (req.body.password) {
          user.password = req.body.password;
        }

        user.save(function (err) {
          if (err) {
            return res.send(err);
          }
          res.json({
            success: true,
            message: 'Updated succesfully'
          });
        });
      });
    })
    // DELETE /api/users/:user_id
    .delete(function (req, res) {
      User.remove({ _id: req.params.user_id }, function (err, user) {
        if (err) {
          return res.send(err);
        }
        res.json({
          success: true,
          message: 'Deleted successfully!'
        });
      });
    });
};