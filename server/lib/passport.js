require('dotenv').config()
const passport = require('koa-passport')
const models = require('../models')

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await models.users.findById(id)
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
    models.users.findOrCreate({where: {github_id: profile.id}, defaults: {
      name: profile._json.username,
      email: profile._json.email,
      github_id: profile._json.id
    }}).spread((user, created) => cb(null, user))
  }
));
