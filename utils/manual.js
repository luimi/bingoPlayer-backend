const { Jimp } = require('jimp');
const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;

let worker;

const getCard = async (imagePath) => {
    if (!worker) {
        worker = await createWorker('eng')
        worker.setParameters({
            tessedit_char_whitelist: '0123456789',
        });
    }
    // Cambiar el tono de la imagen a blanco y negro
    try {
        const image = await Jimp.read(imagePath);
        await image.greyscale().write(imagePath);
    } catch (err) {
        return { success: false, code: 2 }
    }

    // Pasar el OCR para identificar los numeros
    const {
        data: { text },
    } = await worker.recognize(imagePath);

    if (!text) {
        return { success: false, code: 3 }
    }

    const result = [];
    text.split("\n").forEach((row) => {
        let numbers = row.trim();
        numbers = numbers.replace(/\s/g, "");
        if (numbers.length >= 7) result.push(getRow(numbers))
    });

    // Evaluar la respuesta
    if (result.length !== 5) {
        return { success: false, code: 4 }
    }
    return { success: true, data: result }
}

const getRow = (ocr) => {
    let result = [];
    let i = ocr.length - 1;
    let letter = 4;
    const ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];
    const isInRange = (_number, _letter) => {
        return _number >= ranges[_letter][0] && _number <= ranges[_letter][1]
    }
    while (i >= 0 && result.length < 5) {
        const number = parseInt(i > 0 ? ocr.substr(i - 1, 2) : ocr.substr(i, 1));
        if (letter >= 0 && isInRange(number, letter)) {
            result.unshift(number);
            i -= 2;
        } else if (letter > 0 && isInRange(number, letter - 1)) {
            result.unshift(0);
        } else {
            result.unshift(0);
            i -= 2;
        }
        letter--;
    }
    while (result.length < 5) {
        result.unshift(0);
    }
    return result;
}

module.exports = getCard