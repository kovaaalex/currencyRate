const fs = require('fs');

function generateData(baseDate, baseRates) {
    const result = {};
    for (let i = 13; i > 0; i--) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() - i);
        const dateString = currentDate.toISOString().split('T')[0];
        const rates = {};
        for (const currency in baseRates) {
            const randomChange = (Math.random() * 0.1) - 0.05;
            rates[currency] = parseFloat((baseRates[currency] * (1 + randomChange)).toFixed(2));
        }
        result[dateString] = rates;
    }
    return result;
}

const filePath = './twoWeeksCurrency.json';
let existingData = {};

try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    existingData = JSON.parse(fileData);
} catch (err) {
    console.error('Error while read data:', err);
}

const baseDateString = Object.keys(existingData)[0];
const baseDate = new Date(baseDateString);
const baseRates = existingData[baseDateString];

const newData = generateData(baseDate, baseRates);
const updatedData = { ...existingData, ...newData };

try {
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log('Data successfully added');
} catch (err) {
    console.error('Error while write data:', err);
}

const transformedData = {};

for (const date in data) {
    const currentDate = new Date(date);
    const diffInTime = baseDate - currentDate;
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    transformedData[diffInDays] = data[date];
}

console.log(JSON.stringify(transformedData, null, 2));