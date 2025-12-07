require('dotenv').config();
const { Groq } = require('groq-sdk');
const utils = require('./utils.js');
const constants = require('./constants.js');

const groq = new Groq();
const { GROQ_MODEL } = process.env;

const getCards = async (imagePath) => {
    const base64Image = await utils.img2b64(imagePath);
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": constants.prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": base64Image
                            }
                        }
                    ]
                }
            ],
            "model": GROQ_MODEL,
            "temperature": 1,
            "max_completion_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });
        return chatCompletion.choices[0].message.content;
    } catch (e) {
        console.log("error", e)
        return null;
    }

}

module.exports = getCards