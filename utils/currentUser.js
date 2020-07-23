const users = [];

// To get all users
function userJoin(id, username) {
  const user = { id, username };
  users.push(user);
  return user;
}

// Get the user (client side)
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  userJoin,
  getCurrentUser,
};
