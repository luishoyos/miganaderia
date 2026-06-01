import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const pdfPath = 'c:/projects/miganaderia/Formato 1_Todos los animales vivos.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });
parser.getText().then(result => {
  console.log("PDF TEXT Length:", result.text.length);
  fs.writeFileSync('C:/Users/luiho/.gemini/antigravity/brain/d7ae3f91-ec23-43d7-936c-e82549abef05/scratch/pdf_text.txt', result.text);
  console.log("PDF Text written successfully");
}).catch(err => {
  console.error("Error parsing PDF:", err);
});
