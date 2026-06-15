require('dotenv').config();
const OpenAI = require('openai');
const constants = require('./constants.js');
const utils = require('./utils.js');

const { NVIDIA_API_KEY, NVIDIA_MODEL } = process.env;
const openai = new OpenAI({
    apiKey: NVIDIA_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1',
});

const getCards = async (imagePath) => {
    const base64Image = await utils.img2b64(imagePath);
    const result = await openai.chat.completions.create({
        model: NVIDIA_MODEL,
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
                        'image_url': {
                            url: `data:${base64Image}`,
                        },
                    },
                ],
            },
        ],
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 65536,
        reasoning_budget: 16384,
        chat_template_kwargs: { "enable_thinking": true },

        stream: false,
    });
    return result.choices[0].message.content
}

module.exports = getCards