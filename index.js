require('dotenv').config()
const express = require('express')
const path = require('path');
const multer = require('multer');
const cron = require("node-cron");


const { md2json, validateCards, analytic, deleteImage } = require('./utils/utils');
const gemini = require('./utils/gemini');
const openrouter = require('./utils/openrouter');
const groq = require('./utils/groq');
const nvidia = require('./utils/nvidia');

const fs = require('fs');
const app = express();

const { PORT } = process.env
const { GROQ_API_KEY, GROQ_MODEL, GROQ_LIMIT }= process.env
const { OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_LIMIT }= process.env
const { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_LIMIT }= process.env
const { NVIDIA_API_KEY, NVIDIA_MODEL, NVIDIA_LIMIT } = process.env

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

const providers = []

if (GEMINI_API_KEY && GEMINI_MODEL && GEMINI_LIMIT) {
    providers.push({ id: 'Gemini', action: gemini, limit: parseInt(GEMINI_LIMIT), used: 0 })
}

if (GROQ_API_KEY && GROQ_MODEL && GROQ_LIMIT) {
    providers.push({ id: 'Groq', action: groq, limit: parseInt(GROQ_LIMIT), used: 0 })
}

if (NVIDIA_API_KEY && NVIDIA_MODEL && NVIDIA_LIMIT) {
    providers.push({ id: 'Nvidia', action: nvidia, limit: parseInt(NVIDIA_LIMIT), used: 0 })
}

if (OPENROUTER_API_KEY && OPENROUTER_MODEL && OPENROUTER_LIMIT) {
    providers.push({ id: 'OpenRouter', action: openrouter, limit: parseInt(OPENROUTER_LIMIT), used: 0 })
}





cron.schedule(
    "0 0 * * *",
    () => {
        console.log("* limites reiniciados");
        process.exit(1);
    },
    {
        scheduled: true,
        timezone: "UTC"
    }
);

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

    let md;
    let provider
    for (let index = 0; index < providers.length; index++) {
        provider = providers[index];
        if (provider.used >= provider.limit) continue;
        try {
            md = await provider.action(req.file.path);
            provider.used++;
            break;
        } catch (e) { }
    }
    status = !providers.every(provider => provider.used === provider.limit);

    if(!md) return res.send({success: false, code: 4});

    let obj;
    let result;
    if (md) obj = md2json(md);
    if (!obj || obj.length === 0 || !validateCards(obj)) {
        analytic(provider.id, md, req.file.path)
        result = { success: false, code: 4 }
    } else {
        result = { success: true, data: obj }
    }

    // Eliminar imagen subida
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        }
    });

    return res.send(result)
})

app.get('/status', (req, res) => {
    res.send({ status, limits: providers.map((provider) => {return{limit: provider.limit, used: provider.used, name: provider.id} }) })
})
app.delete('/analytic', async (req, res) => {
    if (!req.query.id) {
        return res.send({ success: false, code: 1 })
    }
    res.send(await deleteImage(req.query.id));
})

app.listen(PORT, () => {
    console.log(`* Servidor escuchando en el puerto ${PORT}`)
})