const jwt = require('jsonwebtoken');
const superSecret = require('../../config/env').secret;

module.exports = function (apiRouter) {
  apiRouter.use(function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, superSecret, function (err, decoded) {
        console.log(decoded);
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token!'
          });
        }

        req.decoded = decoded;
        next();
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided!'
      });
    }
  });
}