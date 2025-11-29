// ----------------------------
// TRANSLATION LOGIC
// ----------------------------

// ENGLISH → DIGIT CONVERTER
const ENGLISH_NUMBERS = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
    "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19,
    "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
    "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90,
    "hundred": 100, "thousand": 1000
};

/**
 * Convert English number words to digits
 * @param {string} text - English number words
 * @returns {number} - Converted number
 */
function englishWordsToNumber(text) {
    text = text.toLowerCase().replace("-", " ");
    const parts = text.split(" ");

    let total = 0;
    let current = 0;

    for (const word of parts) {
        if (!ENGLISH_NUMBERS.hasOwnProperty(word)) {
            throw new Error(`Unknown English number word: "${word}"`);
        }

        const value = ENGLISH_NUMBERS[word];

        if (value === 100) {
            current *= 100;
        } else if (value === 1000) {
            current *= 1000;
            total += current;
            current = 0;
        } else {
            current += value;
        }
    }

    return total + current;
}

// ----------------------------
// DIGIT → KIBEMBE
// ----------------------------
const KIBEMBE_ONES = {
    0: "sifuri", 1: "emo", 2: "abele", 3: "asatu", 4: "enaci",
    5: "etanɔ", 6: "ntoba", 7: "mwenji", 8: "enane", 9: "enda"
};

/**
 * Convert number to Kibembe language
 * @param {number} n - Number to convert
 * @returns {string} - Kibembe translation
 */
function numberToKibembe(n) {
    if (n < 10) {
        return KIBEMBE_ONES[n];
    }

    if (n < 20) {
        return `iomi na ${KIBEMBE_ONES[n - 10]}`;
    }

    if (n < 100) {
        const tens = Math.floor(n / 10);
        const ones = n % 10;
        const tensWord = `ikana ${KIBEMBE_ONES[tens]}`;
        return ones === 0 ? tensWord : `${tensWord} na ${KIBEMBE_ONES[ones]}`;
    }

    if (n < 1000) {
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        const hundredsWord = `ikana ${KIBEMBE_ONES[hundreds]}`;
        return remainder === 0 ? hundredsWord : `${hundredsWord} na ${numberToKibembe(remainder)}`;
    }

    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;
    const thousandsWord = `elufu ${numberToKibembe(thousands)}`;
    return remainder === 0 ? thousandsWord : `${thousandsWord} na ${numberToKibembe(remainder)}`;
}

// ----------------------------
// MAIN TRANSLATION FUNCTION
// ----------------------------

/**
 * Main function to translate input to Kibembe
 * @param {string} inputValue - Input number as digits or English words
 * @returns {string} - Kibembe translation
 */
function translateToKibembe(inputValue) {
    inputValue = inputValue.trim().toLowerCase();

    // If it's a digit: "123"
    if (/^\d+$/.test(inputValue)) {
        const num = parseInt(inputValue, 10);
        if (num > 9999) {
            throw new Error("Number too large. Please enter a number less than 10000.");
        }
        return numberToKibembe(num);
    }

    // If it's English words: "one hundred twenty three"
    const num = englishWordsToNumber(inputValue);
    if (num > 9999) {
        throw new Error("Number too large. Please enter a number less than 10000.");
    }
    return numberToKibembe(num);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        englishWordsToNumber,
        numberToKibembe,
        translateToKibembe,
        ENGLISH_NUMBERS,
        KIBEMBE_ONES
    };
}
