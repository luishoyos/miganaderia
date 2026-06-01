import express from 'express';
import animalController from '../controllers/animal.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas de animales
router.get('/', authMiddleware, animalController.getAnimals);
router.get('/census-status', authMiddleware, animalController.getCensusStatus);
router.post('/upload-census', authMiddleware, animalController.uploadCensus);

export default router;
