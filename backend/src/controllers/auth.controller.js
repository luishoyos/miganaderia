import authService from '../services/auth.service.js';

export const authController = {
  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.loginUser(email, password);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  },

  // Register
  async register(req, res) {
    try {
      const { email, password, fullName, tenantId } = req.body;

      if (!email || !password || !fullName || !tenantId) {
        return res
          .status(400)
          .json({ error: 'Email, password, fullName and tenantId are required' });
      }

      const result = await authService.registerUser(email, password, fullName, tenantId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await authService.getUserById(userId);

      // Normalize DB snake_case fields to camelCase for frontend consistency
      const normalizedUser = user
        ? {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            tenantId: user.tenant_id,
            userType: user.user_type,
            isActive: user.is_active,
          }
        : null;

      return res.status(200).json({ success: true, user: normalizedUser });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await authService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

export default authController;
