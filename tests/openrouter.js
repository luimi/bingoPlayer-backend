import openrouter from '../utils/openrouter.js';
import { imagePath, md2json } from '../utils/utils.js';

let result = await openrouter(imagePath('example6.jpg'))
if (result) result = md2json(result);
console.log(result);

process.exit(0);
