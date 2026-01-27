import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { Jimp } from 'jimp';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()

const { ANALYTIC_SERVER, ANALYTIC_APPID, ANALYTIC_RESTID, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export const md2json = (md) => {
    try {
        const cleanedString = md.replace(/```json\n/g, '')
            .replace(/JSON/g, '')
            .replace(/\n```/g, '')
            .replace(/\s+/g, '')
            .trim();

        const m3b = cleanedString.match(/\[\[\[.*?\]\]\]/g);
        let last;
        if (m3b) {
            last = m3b.at(-1);
        } else {
            const m2b = cleanedString.match(/\[\[.*?\]\]/g);
            if (m2b) last = `[${m2b.at(-1)}]`;
        }
        return JSON.parse(last);
    } catch (e) {
        console.error("Error parsing JSON string:");
        console.log(md)
        return null;
    }
}
export const imagePath = (imageName) => {
    return path.join(import.meta.dirname, '../uploads', imageName);
}

export const img2b64 = async (imagePath) => {
    const mimetype = `image/${imagePath.endsWith('.png') ? 'png' : 'jpeg'}`;
    const image = await Jimp.read(imagePath);
    image.resize({ w: 1024 });
    return await image.getBase64(mimetype);
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
    if (!ANALYTIC_APPID || !ANALYTIC_RESTID || !ANALYTIC_SERVER || !CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return;
    const image = await img2b64(imagePath)
    const url = await uploadImage(image)
    const myHeaders = new Headers();
    myHeaders.append("X-Parse-Application-Id", ANALYTIC_APPID);
    myHeaders.append("X-Parse-REST-API-Key", ANALYTIC_RESTID);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "server": server,
        "result": result,
        "image": url
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(`${ANALYTIC_SERVER}/classes/CardsScan`, requestOptions);
}

export const uploadImage = async (image) => {
    const uploadResult = await cloudinary.uploader
        .upload(image, {})
        .catch((error) => {
            console.log(error);
        });
    return uploadResult.url;
}

export const deleteImage = async (imageId) => {
    const result = await cloudinary.uploader.destroy(imageId, {
        invalidate: true // Invalidate CDN cache
    });
    return result;
}