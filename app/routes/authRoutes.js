const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/api');
  });

  app.post('/api/auth', passport.authenticate('local', {
    successRedirect: '/api/',
    failureRedirect: '/',
    failureFlash: true
  }));

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
}