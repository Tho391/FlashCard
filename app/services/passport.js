const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../../config/key');
const User = require('../models/user');


const FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  if (profile.id) {
    console.log(accessToken, refreshToken, profile, done);
    User.findOne({
        googleId: profile.id
      })

      .then(existingUser => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          let user = new User({
            googleId: profile.id,
            name: profile.name.familyName + ' ' + profile.name.givenName,
            email: profile.emails[0].value
          });

          user.save().then(user => done(null, user));
        }
      });
  }
}));


passport.use('local', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
  User.findOne({ username: req.body.username })

    .select('name username password permission').exec(function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      } else {
        let validPwd = user.comparePassword(req.body.password);

        if (validPwd) {
          let validUser = user.toObject();
          delete validUser.password;
          return done(null, validUser);
        } else {
          return done(null, false);
        }
      }
    });

}));


//fb nè
passport.use(new FacebookStrategy({
  clientID: keys.facebookAppID,
  clientSecret: keys.facebookAppSecret,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log(accessToken, refreshToken, profile, done);
    //return done(null, profile);

    if (profile.id) {
      User.findOne({
          facebookId: profile.id
        })
        .then(existingUser => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            let user = new User({
              facebookId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value
            });
            user.save().then(user => done(null, user));
          }
        });
    }

  });
}
));

