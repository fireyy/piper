module.exports = {
  mysql: {
    connectionLimit: 10,
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'piper'
  },
  qiniu: {
    ACCESS_KEY: 'YOUR QINIU AK',
    SECRET_KEY: 'YOUR QINIU SK',
    bucket: 'YOUR QINIU BUCKET',
    baseUrl: 'YOUR QINIU URL'
  },
  opads: {
    url: 'YOUR OPADS URL',
    project: 'YOUR OPADS PROJECT',
    authkey: 'YOUR OPADS AUTHKEY'
  }
}
