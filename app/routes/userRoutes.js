const User = require('../models/user');
const requireAuthentication = require('../middlewares/requireAuthentication');
const requireAdminPermission = require('../middlewares/requireAdminPermission');
const requireVariousPerson = require('../middlewares/requireVariousPerson');
const requireSamePerson = require('../middlewares/requireSamePerson');

module.exports = function (apiRouter) {
  apiRouter.get('/', [requireAuthentication], function (req, res) {
    res.json({ message: 'Hooray! Welcome to our api!' });
  });

  apiRouter.route('/users')
    // GET /api/users
    .get([
      requireAuthentication,
      requireAdminPermission
    ], function (req, res) {
      User.find(function (error, users) {
        if (error) {
          return res.send(error);
        }
        res.json(users);
      });
    })
    // POST /api/users
    .post([
      requireAuthentication,
      requireAdminPermission
    ], function (req, res) {
      let user = new User();
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

  apiRouter.route('/users/:userId')
    // GET /api/users/:userId
    .get([
      requireAuthentication,
      requireSamePerson
    ], function (req, res) {
      User.findById(req.params.userId, function (err, user) {
        if (err) {
          return res.send(err);
        }
        res.json(user);
      });
    })
    // PUT /api/users/:userId
    .put([
      requireAuthentication,
      requireAdminPermission
    ], function (req, res) {
      User.findById(req.params.userId, function (err, user) {
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
    // DELETE /api/users/:userId
    .delete([
      requireAuthentication,
      requireAdminPermission,
      requireVariousPerson
    ], function (req, res) {
      User.remove({ _id: req.params.userId }, function (err, user) {
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