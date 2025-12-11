import gemini from './utils/gemini.js';
import openrouter from './utils/openrouter.js';
import groq from './utils/groq.js';
import manual from './utils/manual.js';
import openai from './utils/openai.js';
import { imagePath, md2json, validateCards } from './utils/utils.js';

const providers = {
    'gemini': gemini,
    'openrouter': openrouter,
    'groq': groq,
    'manual': manual,
    'openai': openai,
}

const [_, __, provider, image] = process.argv;

if(!provider || !image) {
    console.error("Provider or image missing");
    process.exit(0);
}

if(!providers[provider]) {
    console.error(`Provider ${provider} does not exists`);
    process.exit(0);
}

let result = await providers[provider](imagePath(image))
if (result) result = md2json(result);
console.log("cards", result, "provider", provider, "image", image, "valid", validateCards(result));

process.exit(0);