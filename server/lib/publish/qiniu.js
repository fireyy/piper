const _ = require('lodash')
const qiniu = require('qiniu')
const config = require('../../config.js')

const getUptoken = (key) => {
  if (_.isEmpty(key)) return

  const putPolicy = new qiniu.rs.PutPolicy(`${config.qiniu.bucket}/${key}`)
  return putPolicy.token()
}

const upload = (uptoken, localFile) => {

  if (_.isEmpty(uptoken)) return

  const extra = new qiniu.io.PutExtra()

  return new Promise((resolve, reject) => {
    qiniu.io.putFile(uptoken, null, localFile, extra, (err, ret) => {
      if (!err) {
        resolve({
          hash: ret.hash,
          key: ret.key,
          url: `${config.qiniu.baseUrl}/${ret.key}`
        })
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
}

module.exports = async (files) => {

  if (
    config.qiniu.ACCESS_KEY === 'YOUR QINIU AK' ||
    config.qiniu.SECRET_KEY === 'YOUR QINIU SK' ||
    config.qiniu.bucket === 'YOUR QINIU BUCKET' ||
    config.qiniu.baseUrl === 'YOUR QINIU URL'
    ) {
    throw { status: 404, name: 'UPLOAD_ERROR_CONFIG', message: '请在 server/config.js 里修改 qiniu 上传相关的配置' };
  }

  let tasks = files.map((file, key) => upload(getUptoken(file.name), file.path));

  return await Promise.all(tasks);
}
