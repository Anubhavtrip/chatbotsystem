const authService = require('./auth.service');
const { success } = require('../../utils/response');
const { HTTP_STATUS } = require('../../constants');

const authController = {
  async signup(req, res) {
    const result = await authService.signup(req.body);
    return success(res, result, HTTP_STATUS.CREATED);
  },

  async login(req, res) {
    const result = await authService.login(req.body);
    return success(res, result);
  },

  async refresh(req, res) {
    const result = await authService.refresh(req.body.refreshToken);
    return success(res, result);
  },
};

module.exports = authController;
