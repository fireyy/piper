require('./build/check-versions')()

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const src = env === 'production' ? './dist/index' : './server/index';
const opn = require('opn')
const config = require('./config')

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser

if (env === 'development') {
  require('babel-register');
}

const app = require(src);

app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }

  var uri = 'http://localhost:' + port

  console.log('> Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (autoOpenBrowser && env === 'development') {
    //opn(uri)
  }
});
