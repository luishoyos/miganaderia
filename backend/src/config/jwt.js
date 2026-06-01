import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const generateToken = (userId, tenantId, userType = 'user') => {
  return jwt.sign(
    {
      userId,
      tenantId,
      userType, // 'user', 'veterinarian', 'admin'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyToken, decodeToken };
