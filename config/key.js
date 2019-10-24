require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  expressSessionSecret: process.env.EXPRESS_SESSION_SECRET,
  cookieKey: process.env.COOKIE_SESSION_KEY,
  cookieMaxAge: process.env.COOKIE_SESSION_MAXAGE,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  facebookAppID: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET
};