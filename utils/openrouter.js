require('dotenv').config();
const { OpenRouter } = require('@openrouter/sdk');
const constants = require('./constants.js');
const utils = require('./utils.js');

const { OPENROUTER_API_KEY, OPENROUTER_MODEL } = process.env;

const openRouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://bingoplayer.lui2mi.com',
        'X-Title': 'BingoPlayer',
    },
});

const getCards = async (imagePath) => {
    const base64Image = await utils.img2b64(imagePath);
    const result = await openRouter.chat.send({
        model: OPENROUTER_MODEL,
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
}

module.exports = getCards