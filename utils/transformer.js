module.exports = {
    getRow: (ocr) => {
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
    },
    stringToJson: (jsonString) => {
        try {
            const cleanedString = jsonString.replace(/```json\n/g, '').replace(/\n```/g, '').trim();
            const jsonObject = JSON.parse(cleanedString);
            return jsonObject;
        } catch (error) {
            console.log(jsonString)
            console.error("Error parsing JSON string:", error);
            return null;
        }
    }
}