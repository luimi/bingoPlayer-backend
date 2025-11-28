require('dotenv').config()
const { GoogleGenAI }  = require("@google/genai");
const { prompt } = require('../utils/constants');
const fs = require("fs");

const { GEMINI_MODEL } = process.env

const ai = new GoogleGenAI({});

module.exports = {
    getCards: async (imagePath) => {

        if (!fs.existsSync(imagePath)) {
            throw new Error(`Error: El archivo de imagen no se encuentra en la ruta: ${imagePath}`);
        }

        const base64ImageFile = fs.readFileSync(imagePath, {
            encoding: "base64",
        });
        
        const contents = [
            {
                inlineData: {
                    mimeType: imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg',
                    data: base64ImageFile,
                },
            },
            { text: prompt },
        ];
        
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: contents,
        });

        return response.text;
    }
}