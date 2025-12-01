const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (userId, userRole) => {
  return jwt.sign(
    {
      userId,
      role: userRole,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateToken,
  generateResetToken,
  hashResetToken,
};
