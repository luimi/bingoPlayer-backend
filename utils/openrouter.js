require('dotenv').config();
const { OpenRouter } = require('@openrouter/sdk');
const constants = require('./constants.js');
const fs = require("fs");

const { OPENROUTER_API_KEY, OPENROUTER_MODEL_ID } = process.env;

const openRouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://lui2mi.com',
        'X-Title': 'lui2mi',
    },
});

const encodeImageToBase64 = async (imagePath) => {
    const imageBuffer = await fs.promises.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return `data:image/${imagePath.endsWith('.png') ? 'png' : 'jpeg'};base64,${base64Image}`;
}

const getCards = async (imagePath) => {
    const base64Image = await encodeImageToBase64(imagePath);
    try {
        const result = await openRouter.chat.send({
            model: OPENROUTER_MODEL_ID,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: constants.prompt,
                        },
                        {
                            type: 'image_url',
                            imageUrl: {
                                url: base64Image,
                            },
                        },
                    ],
                },
            ],
            stream: false,
        });
        return result.choices[0].message.content
    } catch (e) {
        console.log("error", e)
        return null;
    }
}

module.exports = getCards