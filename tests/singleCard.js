import Tesseract from 'tesseract.js';
import transformer from '../utils/transformer.js';

const { createWorker } = Tesseract;
const worker = await createWorker('eng');
await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
});
const {
    data: { text },
} = await worker.recognize('./uploads/example1.jpeg');

const result = [];
text.split("\n").forEach((row) => {
    let numbers = row.trim();
    numbers = numbers.replace(/\s/g, "");
    if (numbers.length >= 7) result.push(transformer.getRow(numbers))
});

console.log(result);

process.exit(0);