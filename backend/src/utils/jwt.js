const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('./AppError');
const { HTTP_STATUS } = require('../constants');

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch {
    throw new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED);
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.jwt.refreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
