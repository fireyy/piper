const users = require('../users');

module.exports = list => {
  let userSet = new Set();
  let lookfor = { 'create_by': 'create_by', 'user_id': 'user' };
  let lookforKeys = Object.keys(lookfor);
  list.forEach(item => {
    lookforKeys.filter(key => key in item).forEach(key => {
      userSet.add(item[key]);
    });
  });
  let userIdList = [...userSet];
  let userList = users;
  let userMap = Object.create(null);
  userList.forEach(user => {
    if (!user) return;
    let { id, email, name } = user;
    userMap[user.id] = { id, email, name };
  });
  list.forEach(item => {
    lookforKeys.filter(key => key in item).forEach(key => {
      item[lookfor[key]] = userMap[item[key]] || null;
    });
  });
}