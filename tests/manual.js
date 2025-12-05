import manual from '../utils/manual.js';
import { imagePath } from '../utils/utils.js';

const result = await manual(imagePath('example1.jpeg'))
console.log(result);

process.exit(0);