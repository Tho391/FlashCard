const jwt = require('jsonwebtoken');
const superSecret = require('../../config/env').secret;
const User = require('../models/user');

module.exports = function (apiRouter) {
  apiRouter.post('/login', function (req, res) {
    User.findOne({ username: req.body.username })
      .select('_id name username password permission').exec(function (err, user) {
        if (err) {
          throw err;
        }

        if (!user) {
          res.json({
            success: false,
            message: 'Authenticate failed. User not found!'
          })
        } else {
          let validPwd = user.comparePassword(req.body.password);
          if (!validPwd) {
            res.json({
              success: false,
              message: 'Authenticate failed. Wrong password!'
            });
          } else {
            let token = jwt.sign({
              id: user._id,
              name: user.name,
              username: user.username,
              permission: user.permission
            }, superSecret, {
              expiresIn: '24h'
            });

            res.json({
              success: true,
              message: 'Authenticate successfully!',
              token: token
            });
          }
        }
      });
  });
}