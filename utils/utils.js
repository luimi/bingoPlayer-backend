import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config()

const { ANALYTIC_SERVER, ANALYTIC_APPID, ANALYTIC_RESTID } = process.env

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

export const analytic = async (server, result, imagePath) => {
    if(!ANALYTIC_APPID || !ANALYTIC_RESTID || !ANALYTIC_SERVER) return;
    const image = await img2b64(imagePath)
    const myHeaders = new Headers();
    myHeaders.append("X-Parse-Application-Id", ANALYTIC_APPID);
    myHeaders.append("X-Parse-REST-API-Key", ANALYTIC_RESTID);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "server": server,
        "result": result,
        "image": image
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(`${ANALYTIC_SERVER}/classes/CardsScan`, requestOptions);
}