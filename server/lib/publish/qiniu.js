require('dotenv').config();
const _ = require('lodash')
const qiniu = require('qiniu')

let {
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BUCKET,
  QINIU_BASEURL
} = process.env;

qiniu.conf.ACCESS_KEY = QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = QINIU_SECRET_KEY;

const getUptoken = (key) => {
  if (_.isEmpty(key)) return

  const putPolicy = new qiniu.rs.PutPolicy(`${QINIU_BUCKET}:${key}`)
  return putPolicy.token()
}

const upload = (uptoken, localFile) => {

  if (_.isEmpty(uptoken)) return

  const extra = new qiniu.io.PutExtra()

  return new Promise((resolve, reject) => {
    qiniu.io.putFile(uptoken, localFile, localFile, extra, (err, ret) => {
      if (!err) {
        resolve({
          hash: ret.hash,
          key: ret.key,
          url: `${QINIU_BASEURL}/${ret.key}`
        })
      } else {
        console.log("upload error", err, localFile)
        reject(err)
      }
    })
  })
}

module.exports = async (files) => {

  if (
    QINIU_ACCESS_KEY === 'YOUR QINIU AK' ||
    QINIU_SECRET_KEY === 'YOUR QINIU SK' ||
    QINIU_BUCKET === 'YOUR QINIU BUCKET' ||
    QINIU_BASEURL === 'YOUR QINIU URL'
    ) {
    throw { status: 404, name: 'UPLOAD_ERROR_CONFIG', message: '请在 process.env 里配置 qiniu 上传相关的配置: QINIU_ACCESS_KEY/QINIU_SECRET_KEY/QINIU_BUCKET/QINIU_BASEURL' };
  }

  let tasks = files.map((file, key) => upload(getUptoken(file.path), file.path));

  return await Promise.all(tasks);
}
