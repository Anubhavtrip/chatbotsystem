const userRepository = require('../../repositories/user.repository');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const AppError = require('../../utils/AppError');
const { HTTP_STATUS } = require('../../constants');

const authService = {
  async signup({ email, password, name }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', HTTP_STATUS.CONFLICT);
    }

    const user = await userRepository.create({ email, password, name });
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, true);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', HTTP_STATUS.FORBIDDEN);
    }

    const tokens = await this.generateTokens(user);
    await userRepository.updateById(user._id, { lastLoginAt: new Date() });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  },

  async refresh(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepository.findByEmail(decoded.email, true);

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    const tokens = await this.generateTokens(user);
    return tokens;
  },

  async generateTokens(user) {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await userRepository.updateRefreshToken(user._id, refreshToken);

    return { accessToken, refreshToken };
  },

  sanitizeUser(user) {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      brandIds: user.brandIds?.map((id) => id.toString()) || [],
    };
  },
};

module.exports = authService;
