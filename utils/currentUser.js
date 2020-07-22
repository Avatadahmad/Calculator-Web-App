const users = [];

function userJoin(id, username) {
  const user = { id, username };

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  userJoin,
  getCurrentUser,
};
