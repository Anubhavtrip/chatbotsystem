const User = require('../modules/auth/user.model');

const userRepository = {
  create(data) {
    return User.create(data);
  },

  findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) query.select('+password +refreshToken');
    return query;
  },

  findById(id) {
    return User.findById(id);
  },

  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  updateRefreshToken(id, refreshToken) {
    return User.findByIdAndUpdate(id, { refreshToken }, { new: true });
  },
};

module.exports = userRepository;
