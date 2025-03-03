const valuteNames = document.querySelectorAll('span');
const inputIn = document.getElementById('input__in');
const inputOut = document.getElementById('input__out');
const datePicker = document.getElementById('date__picker');
const today = new Date().toISOString().split('T')[0];
datePicker.setAttribute('max', today);
let in__currency = 'BYN', out__currency = 'BYN';
let conversionRates = {};
let historicalRates = {};
async function loadHistoricalData() {
    try {
        const response = await fetch('./twoWeeksCurrency.json');
        const data = await response.json();
        historicalRates = data;
    } catch (error) {
        console.error('Error loading historical data:', error);
    }
}
async function fetchConversionRates() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/56f9dd5997ec6a47b0fd64fa/latest/${in__currency}`);
        const data = await response.json();
        if (data.conversion_rates) {
            conversionRates = data.conversion_rates;
            convertCurrency();
            await handleDateChange();
        } else {
            console.error('Error: Unable to get exchange rates');
        }
    } catch (error) {
        console.error('Error executing request:', error);
    }
}
async function convertCurrency() {
    const amount = parseFloat(inputIn.value);
    if (isNaN(amount)) {
        inputOut.value = '';
        return;
    }
    if (in__currency === out__currency) {
        inputOut.value = amount.toFixed(2);
        return;
    }
    const rateIn = conversionRates[in__currency];
    const rateOut = conversionRates[out__currency];
    if (rateIn && rateOut) {
        const convertedAmount = (amount * rateOut) / rateIn;
        inputOut.value = convertedAmount.toFixed(2);
    } else {
        console.error('Error: Currency rate not found');
    }
}

function updateRateDisplay(rate) {
    const rateDisplay = document.getElementById('rate__display');
    rateDisplay.innerHTML = `Rate on picked date: 1 ${in__currency} = ${rate} ${out__currency}`;
}

datePicker.addEventListener('change', async () => {
    await handleDateChange();
});

async function handleDateChange() {
    const selectedDate = new Date(datePicker.value);
    const today = new Date();
    const differenceInDays = (today - selectedDate) / (1000 * 3600 * 24);
    let historicalRateIndex = -Math.floor(differenceInDays);
    if (differenceInDays > 14) {
        historicalRateIndex = -13;
    }
    if (historicalRates[historicalRateIndex]) {
        const rate = (historicalRates[historicalRateIndex][out__currency] / historicalRates[historicalRateIndex][in__currency]).toFixed(2);
        
        if (rate) {
            updateRateDisplay(rate);
        } else {
            console.error('Error: Currency rate not found for selected date');
        }
    } else {
        console.error('Error: Data for selected date is missing');
    }
}
valuteNames.forEach(valuteName => valuteName.addEventListener('click', () => chooseValute(valuteName)));
function chooseValute(valuteName) {
    const valuteList = valuteName.parentNode.querySelector('ul');
    valuteList.style.display = 'block';
    valuteList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            if (valuteName.parentNode.id === 'in__container') {
                in__currency = item.textContent;
            } else {
                out__currency = item.textContent;
            }
            valuteName.innerHTML = item.textContent;
            valuteList.style.display = 'none';
            fetchConversionRates();
            convertCurrency();
        });
    });
}
inputIn.addEventListener('input', convertCurrency);
loadHistoricalData();
fetchConversionRates();