import fs from 'fs';

const text = fs.readFileSync('C:/Users/luiho/.gemini/antigravity/brain/d7ae3f91-ec23-43d7-936c-e82549abef05/scratch/pdf_text.txt', 'utf8');

const lines = text.split('\n');
const animals = [];

let currentResena = "";
let pendingRow = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Skip header and footer lines
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
  
  // If the line ends with Sexo (H or M) and the second to last is a Código
  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];
  const isRowEnd = (last === 'H' || last === 'M') && secondLast && secondLast.match(/[A-Z]{3}\d{4}[HM]\d*/);
  
  if (isRowEnd) {
    // We found a row end! Let's combine with any pending row data
    let fullParts = [];
    if (pendingRow) {
      fullParts = [...pendingRow, ...parts];
      pendingRow = null;
    } else {
      fullParts = parts;
    }
    
    // Now let's extract the animal data from fullParts
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
    
    // The rest at the beginning is ULT4 and Reseña
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
  } else {
    // If it's not a row end, it's either a wrapped reseña or father/mother name, or part of a split row.
    // Let's store it as pending
    if (pendingRow) {
      pendingRow = [...pendingRow, ...parts];
    } else {
      pendingRow = parts;
    }
  }
}

console.log(`Parsed ${animals.length} animals!`);
console.log("Example first 3 animals:", animals.slice(0, 3));
console.log("Example last 3 animals:", animals.slice(-3));
