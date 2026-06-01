import { query, getClient } from '../config/db.js';
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from 'pdf-parse';

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

export const animalService = {
  // Obtener la cantidad de animales activos de una ganadería
  async getAnimalCount(tenantId) {
    try {
      const result = await query(
        'SELECT COUNT(*) FROM animals WHERE tenant_id = $1 AND is_active = true',
        [tenantId]
      );
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      throw new Error(`Error counting animals: ${error.message}`);
    }
  },

  // Obtener los animales activos de una ganadería
  async getAnimals(tenantId) {
    try {
      const result = await query(
        'SELECT * FROM animals WHERE tenant_id = $1 AND is_active = true ORDER BY name ASC',
        [tenantId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching animals: ${error.message}`);
    }
  },

  // Parsear el censo de animales desde el búfer del archivo PDF
  async parsePdfCensus(pdfBuffer) {
    try {
      const parser = new PDFParse({ data: pdfBuffer });
      const result = await parser.getText();
      const text = result.text;
      const lines = text.split('\n');
      const animals = [];
      
      let pendingRow = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Omitir cabeceras, pies de página, fechas y marcadores de página
        if (line.includes('LISTADO DE LA GANADERIA') || 
            line.includes('Filtros:') || 
            line.includes('ULT 4\tReseña') || 
            line.includes('UJN VALDELAPEÑA') || 
            /^\d{2}\/\d{2}\/\d{4}$/.test(line) || 
            /^\d+\/\d+$/.test(line) || 
            line.startsWith('--')) {
          continue;
        }
        
        const parts = line.split('\t').map(p => p.trim()).filter(p => p);
        if (parts.length === 0) continue;

        const last = parts[parts.length - 1];
        const secondLast = parts[parts.length - 2];
        const isRowEnd = (last === 'H' || last === 'M') && secondLast && secondLast.match(/[A-Z]{3}\d{4}[HM]\d*/);
        
        if (isRowEnd) {
          let fullParts = [];
          if (pendingRow) {
            fullParts = [...pendingRow, ...parts];
            pendingRow = null;
          } else {
            fullParts = parts;
          }
          
          if (fullParts.length >= 10) {
            const sex = fullParts[fullParts.length - 1];
            const code = fullParts[fullParts.length - 2];
            const name = fullParts[fullParts.length - 3];
            const birthDateStr = fullParts[fullParts.length - 4];
            const crotal = fullParts[fullParts.length - 5];
            const reg = fullParts[fullParts.length - 6];
            const motherCode = fullParts[fullParts.length - 7];
            const motherName = fullParts[fullParts.length - 8];
            const fatherCode = fullParts[fullParts.length - 9];
            const fatherName = fullParts[fullParts.length - 10];
            
            const ult4 = fullParts[0];
            const resenaParts = fullParts.slice(1, fullParts.length - 10);
            const resena = resenaParts.join(', ');
            
            animals.push({
              ult4,
              resena,
              fatherName,
              fatherCode,
              motherName,
              motherCode,
              reg,
              crotal,
              birthDateStr,
              name,
              code,
              sex
            });
          }
        } else {
          if (pendingRow) {
            pendingRow = [...pendingRow, ...parts];
          } else {
            pendingRow = parts;
          }
        }
      }
      
      return animals;
    } catch (error) {
      throw new Error(`Error parsing PDF census: ${error.message}`);
    }
  },

  // Guardar múltiples animales en una transacción de base de datos
  async createAnimals(tenantId, animalsList) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const insertedAnimals = [];
      
      for (const animal of animalsList) {
        const type = animal.sex === 'H' ? 'vaca' : 'toro';
        const birthDate = parseDate(animal.birthDateStr);
        
        const res = await client.query(
          `INSERT INTO animals (
            tenant_id, name, type, breed, birth_date, status, is_active,
            code, crotal, resena, mother_code, mother_name, father_code, father_name, reg
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *`,
          [
            tenantId,
            animal.name,
            type,
            'Lidia', // Raza estándar
            birthDate,
            'active',
            true,
            animal.code,
            animal.crotal,
            animal.resena,
            animal.motherCode,
            animal.motherName,
            animal.fatherCode,
            animal.fatherName,
            animal.reg
          ]
        );
        insertedAnimals.push(res.rows[0]);
      }
      
      await client.query('COMMIT');
      return insertedAnimals;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Transaction failed, rolled back: ${error.message}`);
    } finally {
      client.release();
    }
  }
};

export default animalService;
