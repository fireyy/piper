const asyncBusboy = require('async-busboy');
const authorize = require('../lib/authorize');
const request = require('request-promise');

module.exports = class {
  static url = '/files';

  @authorize([ 'EDIT' ])
  static async post(ctx) {
    const {files, fields} = await asyncBusboy(ctx.req);

    let file = files[0], filename =  "piper/" + new Date().valueOf() + file.filename;

    var options = {
      url: 'http://opads.intra.ffan.com/openapi/nres-upload',
      json: true,
      formData: {
        project     : 'test',
        authkey     : 'a17e3218be131bc8029a4da605c0dd1f',
        'Upload[file]'  : [file],
        'FileName[file]': [filename],
      }
    };

    try {
      let uploadRes = await request.post(options);
      if(uploadRes.code == 0) {
        let firstKey = Object.keys(uploadRes.data['file'])[0]
        ctx.body = uploadRes.data['file'][firstKey]
      } else {
        throw { status: 404, name: 'UPLOAD_ERROR_' + uploadRes.code, message: uploadRes.msg };
      }
    } catch(e) {
      throw { status: 404, name: 'UPLOAD_ERROR', message: 'upload error' };
    }

  }

};
