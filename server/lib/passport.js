require('dotenv').config()
const passport = require('koa-passport')
const User = require('../models/user')

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.find(id)
    done(null, user)
  } catch(err) {
    done(err)
  }
})

const GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:4000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate('github', profile, function (err, user) {
      return cb(err, user);
    });
  }
));
