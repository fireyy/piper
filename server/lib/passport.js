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
    callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    let {
      name,
      email,
      id,
      avatar_url
    } = profile._json;
    models.users.findOrCreate({where: {github_id: id}, defaults: {
      name: name,
      email: email,
      avatar: avatar_url
    }}).spread((user, created) => cb(null, user)).catch(err => {
      console.log(err)
    })
  }
));
