import asyncBusboy from 'async-busboy'
import upload from '../lib/publish'

export default class {
  constructor() {
    this.url = '/files';
  }

  async post(ctx) {
    const {files, fields} = await asyncBusboy(ctx.req);

    let uploadRes = await upload(files);

    ctx.body = uploadRes
  }

};
