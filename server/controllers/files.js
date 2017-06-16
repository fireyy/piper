const asyncBusboy = require('async-busboy');
const upload = require('../lib/publish');

module.exports = class {
  constructor() {
    this.url = '/files';
  }

  async post(ctx) {
    const {files, fields} = await asyncBusboy(ctx.req);

    let uploadRes = await upload(files);

    ctx.body = uploadRes
  }

};
