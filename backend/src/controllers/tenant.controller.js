import tenantService from '../services/tenant.service.js';

export const tenantController = {
  // Create tenant
  async createTenant(req, res) {
    try {
      const { name, location, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Tenant name is required' });
      }

      const result = await tenantService.createTenant(name, location, description);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Get tenant
  async getTenant(req, res) {
    try {
      const { tenantId } = req.params;

      const tenant = await tenantService.getTenantById(tenantId);
      return res.status(200).json({ success: true, tenant });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Get all tenants
  async getAllTenants(req, res) {
    try {
      const tenants = await tenantService.getAllTenants();
      return res.status(200).json({ success: true, tenants });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Update tenant
  async updateTenant(req, res) {
    try {
      const { tenantId } = req.params;
      const updates = req.body;

      const result = await tenantService.updateTenant(tenantId, updates);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Get veterinarian tenants
  async getVeterinarianTenants(req, res) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenants = await tenantService.getVeterinarianTenants(userId);
      return res.status(200).json({ success: true, tenants });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

export default tenantController;
