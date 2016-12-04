const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const src = env === 'production' ? './dist/index' : './server/index';

require('babel-polyfill');
if (env === 'development') {
  require('babel-register');
}

const app = require(src).default;

app.listen(port);
