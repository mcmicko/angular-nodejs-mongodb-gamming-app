const roles = {
  user: 2,
  admin: 4
};

roles.accessLevels = {
  user: roles.user | roles.admin, //can be accessed by users and admins
  admin: roles.admin // can be accessed by admins
};

module.exports = roles;
