require('dotenv').config();
const OpenAI = require('openai');
const constants = require('./constants.js');
const utils = require('./utils.js');

const { OPENAI_API_KEY, OPENAI_MODEL } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const getCards = async (imagePath) => {
    const base64Image = await utils.img2b64(imagePath);

    const result = await openai.chat.completions.create({
        model: OPENAI_MODEL,
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
    });
    return result.choices[0].message.content
}

module.exports = getCards