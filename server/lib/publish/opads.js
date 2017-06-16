require('dotenv').config();
const request = require('request-promise');

let {
  OPADS_URL,
  OPADS_PROJECT,
  OPADS_AUTHKEY
} = process.env;

const getUploadData = data => {
  let arr = [];
  for (const key in data) {
    let firstKey = Object.keys(data[key])[0];
    arr.push(data[key][firstKey])
  }
  return arr
};

module.exports = async (files) => {

  if (
    OPADS_URL === 'YOUR OPADS URL' ||
    OPADS_PROJECT === 'YOUR OPADS PROJECT' ||
    OPADS_AUTHKEY === 'YOUR OPADS AUTHKEY'
    ) {
    throw { status: 404, name: 'UPLOAD_ERROR_CONFIG', message: '请在 process.env 里配置 opads 上传相关的配置：OPADS_URL/OPADS_PROJECT/OPADS_AUTHKEY' };
  }

  let uploadObj = {}

  files.forEach((file, key) => {
    uploadObj[`Upload[file${key}]`] = file;
    uploadObj[`FileName[file${key}]`] = `piper/${file.path}`
  })

  var options = {
    url: OPADS_URL,
    json: true,
    formData: Object.assign({
      project: OPADS_PROJECT,
      authkey: OPADS_AUTHKEY
    }, uploadObj)
  };

  try {
    let uploadRes = await request.post(options);
    if(uploadRes.code == 0) {
      return getUploadData(uploadRes.data)
    } else {
      throw { status: 404, name: 'UPLOAD_ERROR_' + uploadRes.code, message: uploadRes.msg };
    }
  } catch(e) {
    throw { status: 404, name: 'UPLOAD_ERROR', message: 'upload error' };
  }
}
