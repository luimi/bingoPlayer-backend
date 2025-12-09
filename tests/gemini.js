import gemini from '../utils/gemini.js';
import { imagePath, md2json } from '../utils/utils.js';

let result = await gemini(imagePath('example1.jpg'))
if (result) result = md2json(result);
console.log(result);

process.exit(0);
