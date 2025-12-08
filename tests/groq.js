import groq from '../utils/groq.js';
import { imagePath, md2json, validateCards } from '../utils/utils.js';

let result = await groq(imagePath('example1.jpeg'))
if (result) result = md2json(result);
console.log("cards", result, "valid", validateCards(result));

process.exit(0);
