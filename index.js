require('dotenv').config()
const express = require('express')
const path = require('path');
const multer = require('multer');


const { md2json } = require('./utils/utils');
const gemini = require('./utils/gemini');
const openrouter = require('./utils/openrouter');
const groq = require('./utils/groq');

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

const providers = [
    { action: openrouter, limit: 50 },
    { action: groq, limit: 1000 },
]

let limits = [0];
let status = true;

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

    let result;

    try {
        const index = limits.length - 1;
        result = await providers[index].action(req.file.path);
        limits[index]++;
        if(limits[index] === providers[index].limit && limits.length < providers.length) {
            limits.push(0);
        }

    } catch (e) { }

    if(limits.length  === providers.length && limits.at(-1) === providers.at(-1).limit) {
        status = false;
    }

    // Eliminar imagen subida
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        }
    });

    if (result) result = md2json(result);

    if (!result || result.length === 0) {
        return res.send({ success: false, code: 4 })
    }
    return res.send({ success: true, data: result })
})

app.get('/status', (req, res) => {
    res.send({ status, limits })
})

app.listen(PORT, () => {
    console.log(`* Servidor escuchando en el puerto ${PORT}`)
})