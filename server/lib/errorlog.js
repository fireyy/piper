module.exports = async (ctx, next) => {
  try {
    return await next();  
  } catch (error) {
    let { status , name = 'UNKNOWN_ERROR', message = '' } = error;
    if (!status) console.error(error.stack || error);
    ctx.status = status || 500;
    ctx.body = { name, message };
  }
};
