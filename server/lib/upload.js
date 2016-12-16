const request = require('request-promise');

const getUploadData = data => {
  let arr = [];
  for (const key in data) {
    let firstKey = Object.keys(data[key])[0];
    arr.push(data[key][firstKey])
  }
  return arr
};

module.exports = async (files) => {

  let uploadObj = {}

  files.forEach((file, key) => {
    uploadObj[`Upload[file${key}]`] = file;
    uploadObj[`FileName[file${key}]`] = `piper/${file.path}`
  })

  var options = {
    url: 'http://opads.intra.ffan.com/openapi/nres-upload',
    json: true,
    formData: {
      project     : 'test',
      authkey     : 'a17e3218be131bc8029a4da605c0dd1f',
      ...uploadObj
    }
  };

  try {
    let uploadRes = await request.post(options);
    if(uploadRes.code == 0) {
      console.log(uploadRes.data)
      return getUploadData(uploadRes.data)
    } else {
      throw { status: 404, name: 'UPLOAD_ERROR_' + uploadRes.code, message: uploadRes.msg };
    }
  } catch(e) {
    throw { status: 404, name: 'UPLOAD_ERROR', message: 'upload error' };
  }
}
