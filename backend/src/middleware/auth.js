const { verifyAccessToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');
const userRepository = require('../repositories/user.repository');

async function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Access token required', HTTP_STATUS.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  const user = await userRepository.findById(decoded.userId);
  if (!user || !user.isActive) {
    return next(new AppError('User not found or inactive', HTTP_STATUS.UNAUTHORIZED));
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    brandIds: user.brandIds?.map((id) => id.toString()) || [],
  };

  next();
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED));
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', HTTP_STATUS.FORBIDDEN));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
