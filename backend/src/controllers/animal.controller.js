import animalService from '../services/animal.service.js';

export const animalController = {
  // Obtener el estado del censo (si hay animales registrados o no)
  async getCensusStatus(req, res) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID not found in session' });
      }

      const count = await animalService.getAnimalCount(tenantId);
      return res.status(200).json({ 
        success: true, 
        hasCensus: count > 0, 
        count 
      });
    } catch (error) {
      console.error('Error in getCensusStatus:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Cargar censo de animales desde PDF codificado en Base64
  async uploadCensus(req, res) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID not found in session' });
      }

      const { pdfBase64 } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ error: 'No PDF file payload provided' });
      }

      // Convertir base64 a buffer
      const pdfBuffer = Buffer.from(pdfBase64, 'base64');

      // Procesar el PDF
      const parsedAnimals = await animalService.parsePdfCensus(pdfBuffer);
      if (parsedAnimals.length === 0) {
        return res.status(400).json({ 
          error: 'No se pudieron extraer animales del archivo. Verifica que el formato corresponda al de la Unión Toros de Lidia.' 
        });
      }

      // Guardar animales en base de datos
      const insertedAnimals = await animalService.createAnimals(tenantId, parsedAnimals);

      return res.status(201).json({
        success: true,
        message: 'Censo de animales importado con éxito',
        count: insertedAnimals.length,
        animals: insertedAnimals.slice(0, 5) // Devolver una pequeña muestra
      });
    } catch (error) {
      console.error('Error in uploadCensus:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Obtener el listado completo de animales activos
  async getAnimals(req, res) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID not found in session' });
      }

      const animals = await animalService.getAnimals(tenantId);
      return res.status(200).json({ success: true, animals });
    } catch (error) {
      console.error('Error in getAnimals:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};

export default animalController;
