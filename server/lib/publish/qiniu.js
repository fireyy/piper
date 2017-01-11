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

  let tasks = files.map((file, key) => upload(getUptoken(file.name), file.path));

  return await Promise.all(tasks);
}
