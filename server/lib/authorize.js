const users = require('../users');
const _ = require('lodash');

const getUserByCtx = ctx => {
  return users[0]
};

const decorator = (permissions) => {
  return function(base, name, desc) {
    let value = desc.value;
    desc.value = function(ctx, next) {
      let user = ctx.user = getUserByCtx(ctx);
      if (permissions && permissions.length && _.intersection(permissions, user.permissions).length < 0) {
        throw { status: 403, message: '并没有相应的权限', name: 'PERMISSION_FORBIDDEN' };
      }
      let isAdmin = user.permissions.indexOf('ADMIN') >= 0;
      return value.call(this, ctx, next);
    };
  };
};

module.exports = decorator;
