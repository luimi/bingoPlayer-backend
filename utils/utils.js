import path from 'path';
import fs from 'fs';

export const md2json = (md) => {
    try {
        const cleanedString = md.replace(/```json\n/g, '').replace(/\n```/g, '').trim();
        const jsonObject = JSON.parse(cleanedString);
        return jsonObject;
    } catch (error) {
        console.log(md)
        console.error("Error parsing JSON string:", error);
        return null;
    }
}
export const imagePath = (imageName) => {
    return path.join(import.meta.dirname, '../uploads', imageName);
}

export const img2b64 = async (imagePath) => {
    const imageBuffer = await fs.promises.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return `data:image/${imagePath.endsWith('.png') ? 'png' : 'jpeg'};base64,${base64Image}`;
}

export const validateCards = (cards) => {
    let result = true;
    cards.forEach(card => {
        if (card.length !== 5) {
            result = false;
            return;
        }
        card.forEach(row => {
            if (row.length !== 5) {
                result = false;
                return;
            }
        })
    });
    return result;
}