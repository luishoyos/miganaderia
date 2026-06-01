import { query } from '../config/db.js';

export const tenantService = {
  // Crear nueva ganadería (tenant)
  async createTenant(name, location, description) {
    try {
      const result = await query(
        `INSERT INTO tenants (name, location, description, is_active)
         VALUES ($1, $2, $3, true)
         RETURNING *`,
        [name, location, description]
      );

      return { success: true, tenant: result.rows[0] };
    } catch (error) {
      throw new Error(`Error creating tenant: ${error.message}`);
    }
  },

  // Obtener ganadería por ID
  async getTenantById(tenantId) {
    try {
      const result = await query(
        'SELECT * FROM tenants WHERE id = $1',
        [tenantId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching tenant: ${error.message}`);
    }
  },

  // Obtener todas las ganaderías
  async getAllTenants() {
    try {
      const result = await query(
        'SELECT * FROM tenants WHERE is_active = true',
        []
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching tenants: ${error.message}`);
    }
  },

  // Actualizar ganadería
  async updateTenant(tenantId, updates) {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in updates) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index += 1;
      }

      if (fields.length === 0) {
        throw new Error('No update fields provided');
      }

      values.push(tenantId);

      const result = await query(
        `UPDATE tenants SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
        values
      );

      return { success: true, tenant: result.rows[0] };
    } catch (error) {
      throw new Error(`Error updating tenant: ${error.message}`);
    }
  },

  // Obtener ganaderías de un veterinario
  async getVeterinarianTenants(userId) {
    try {
      const result = await query(
        `SELECT t.*
         FROM veterinarian_tenants vt
         JOIN tenants t ON vt.tenant_id = t.id
         WHERE vt.user_id = $1`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching veterinarian tenants: ${error.message}`);
    }
  },
};

export default tenantService;
