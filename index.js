require('dotenv').config()
const express = require('express')
const path = require('path');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { Jimp } = require('jimp');
const transformer = require('./utils/transformer');
const gemini = require('./utils/gemini');
const fs = require('fs');
const app = express();

const { PORT } = process.env

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('API de BingoPlayer')
})

/**
 * Scan bingo card to get its numbers
 * 
 * Errors code:
 * 1 - No image attached
 * 2 - Could not grayscale picture
 * 3 - Error reading image
 * 4 - Error parsing data
 */
app.post('/scan', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.send({ success: false, code: 1 })
    }

    // Cambiar el tono de la imagen a blanco y negro
    try {
        const image = await Jimp.read(req.file.path);
        image.greyscale().threshold({ max: 100 }).write(req.file.path);
    } catch (err) {
        return res.send({ success: false, code: 2 })
    }

    // Pasar el OCR para identificar los numeros
    const { createWorker } = Tesseract;
    const worker = await createWorker('eng');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
    });
    const {
        data: { text },
    } = await worker.recognize(req.file.path);

    if (!text) {
        return res.send({ success: false, code: 3 })
    }

    // Eliminar imagen subida
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        }
    });

    const result = [];
    text.split("\n").forEach((row) => {
        let numbers = row.trim();
        numbers = numbers.replace(/\s/g, "");
        if (numbers.length >= 7) result.push(transformer.getRow(numbers))
    });

    // Evaluar la respuesta
    if (result.length !== 5) {
        return res.send({ success: false, code: 4 })
    }
    return res.send({ success: true, data: result })
})

/**
 * Scan bingo cards to get its numbers
 * 
 * Errors code:
 * 1 - No image attached
 * 2 - Could not grayscale picture
 * 3 - Error reading image
 * 4 - Error parsing data
 */
app.post('/multipleScan', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.send({ success: false, code: 1 })
    }

    // Obtener los cartones
    let result = await gemini.getCards(req.file.path)

    // Eliminar imagen subida
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        }
    });

    result = transformer.stringToJson(result)

    // Evaluar la respuesta
    if (!result || result.length === 0) {
        return res.send({ success: false, code: 4 })
    }
    return res.send({ success: true, data: result })
})

app.listen(PORT, () => {
    console.log(`* Servidor escuchando en el puerto ${PORT}`)
})