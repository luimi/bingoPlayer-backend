import path from 'path';

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