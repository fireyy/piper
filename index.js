require('./build/check-versions')()

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const src = env === 'production' ? './dist/index' : './server/index';
const config = require('./config')

const app = require(src);

// check database
const models = require('./server/models')
models.sequelize.sync().then(function(){
  app.listen(port, function(err) {
    if (err) {
      console.log(err)
      return
    }

    var uri = 'http://localhost:' + port

    console.log('> Listening at ' + uri + '\n')
  });
}).catch(function(err){
  console.error(new Error(err))
});
