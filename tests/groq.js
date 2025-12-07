import groq from '../utils/groq.js';
import { imagePath, md2json } from '../utils/utils.js';

let result = await groq(imagePath('example6.jpg'))
if (result) result = md2json(result);
console.log(result);

process.exit(0);
