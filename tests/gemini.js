import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import path from 'path';
import dotenv from 'dotenv';
import { prompt } from '../utils/constants.js';

dotenv.config()

const ai = new GoogleGenAI({});

const imageName = 'example5.jpg';
const imagePath = path.join(import.meta.dirname, '../uploads', imageName);
const base64ImageFile = fs.readFileSync(imagePath, {
    encoding: "base64",
});

const contents = [
    {
        inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageFile,
        },
    },
    { text: prompt },
];

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
});
console.log(response.text);