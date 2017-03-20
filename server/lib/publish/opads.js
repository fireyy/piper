const request = require('request-promise');
const config = require('../../config.js')

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
    config.opads.url === 'YOUR OPADS URL' ||
    config.opads.project === 'YOUR OPADS PROJECT' ||
    config.opads.authkey === 'YOUR OPADS AUTHKEY'
    ) {
    throw { status: 404, name: 'UPLOAD_ERROR_CONFIG', message: '请在 server/config.js 里修改 opads 上传相关的配置' };
  }

  let uploadObj = {}

  files.forEach((file, key) => {
    uploadObj[`Upload[file${key}]`] = file;
    uploadObj[`FileName[file${key}]`] = `piper/${file.path}`
  })

  var options = {
    url: config.opads.url,
    json: true,
    formData: {
      project: config.opads.project,
      authkey: config.opads.authkey,
      ...uploadObj
    }
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
