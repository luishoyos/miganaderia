import { verifyToken } from '../config/jwt.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  req.tenantId = tenantId;
  next();
};

export const veterinarianMiddleware = (req, res, next) => {
  if (req.user?.userType !== 'veterinarian' && req.user?.userType !== 'admin') {
    return res.status(403).json({ error: 'Only veterinarians can access this resource' });
  }
  next();
};

export default { authMiddleware, tenantMiddleware, veterinarianMiddleware };
