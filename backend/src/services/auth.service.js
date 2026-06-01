import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { generateToken } from '../config/jwt.js';

export const authService = {
  // Registrar un nuevo usuario
  async registerUser(email, password, fullName, tenantId, userType = 'user') {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await query(
        `INSERT INTO users (email, password, full_name, tenant_id, user_type, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         RETURNING *`,
        [email, hashedPassword, fullName, tenantId, userType]
      );

      const row = result.rows[0];
      const normalizedUser = {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        tenantId: row.tenant_id,
        userType: row.user_type,
        isActive: row.is_active,
      };

      return { success: true, user: normalizedUser };
    } catch (error) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  },

  // Login de usuario
  async loginUser(email, password) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.is_active) {
        throw new Error('User is inactive');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user.id, user.tenant_id, user.user_type);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          tenantId: user.tenant_id,
          userType: user.user_type,
        },
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const result = await query(
        `SELECT id, email, full_name, tenant_id, user_type, is_active
         FROM users
         WHERE id = $1`,
        [userId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  // Obtener usuarios de una ganadería
  async getUsersByTenant(tenantId) {
    try {
      const result = await query(
        `SELECT id, email, full_name, user_type, is_active
         FROM users
         WHERE tenant_id = $1`,
        [tenantId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  // Cambiar contraseña
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const result = await query(
        'SELECT password FROM users WHERE id = $1',
        [userId]
      );

      const userData = result.rows[0];

      if (!userData) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);

      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, userId]
      );

      return { success: true };
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  },
};

export default authService;
