import express from 'express';
import tenantController from '../controllers/tenant.controller.js';
import { authMiddleware, tenantMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for listing)
router.get('/', tenantController.getAllTenants);

// Protected routes
router.post('/', authMiddleware, tenantController.createTenant);
router.get('/:tenantId', authMiddleware, tenantController.getTenant);
router.put('/:tenantId', authMiddleware, tenantMiddleware, tenantController.updateTenant);
router.get('/:userId/veterinarian', authMiddleware, tenantController.getVeterinarianTenants);

export default router;
