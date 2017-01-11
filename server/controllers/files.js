const asyncBusboy = require('async-busboy');
const authorize = require('../lib/authorize');
const upload = require('../lib/publish');

module.exports = class {
  static url = '/files';

  @authorize([ 'EDIT' ])
  static async post(ctx) {
    const {files, fields} = await asyncBusboy(ctx.req);

    let uploadRes = await upload(files);

    ctx.body = uploadRes
  }

};
