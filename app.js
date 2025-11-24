document.addEventListener("DOMContentLoaded", () =>{ 
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const resultInput = document.getElementById('result');
const swapBtn = document.getElementById('swapBtn');
const rateInfo = document.getElementById('rateInfo');
const errorMessage = document.getElementById('errorMessage');
const favoriteList = document.getElementById('favoriteList');

let exchangeRates = {};
const API_URL = `https://api.exchangerate-api.com/v4/latest/`;

//sayfa yüklendiğinde kurları getir
async function fetchRates(baseCurrency) {
    try{
        errorMessage.innerHTML='';
        const response = await fetch(API_URL + baseCurrency);
        if(!response.ok){
            throw new Error('Kurlar alınamadı!');
        }
        const data = await response.json();
        exchangeRates = data.rates;
        convertCurrency();
        updateFavoites();
    } catch (error){
        errorMessage.innerHTML = `<div class="error">❌${error.Message}. Lütfen tekrar deneyin.</div>`;
    }
}
//para birimi çevirme
function convertCurrency(){
    const amount = parseFloat(amountInput.value) || 0;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if(exchangeRates[to]){
        //TRY'den başka bir para birimine çeviriyorsak
        const rate = exchangeRates[to];
        const result = amount * rate;
        resultInput.value=result.toFixed(2);

        rateInfo.innerHTML=`1 ${from} = ${rate.toFixed(4)} ${to}`;
    }
}
//para birimlerini değiştir
function swapCurrencies(){
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    fetchRates(fromCurrency.value);
}
//favori dövizleri göster
function updateFavoites(){
    const popularPairs = [
        {from: 'USD', to: 'TRY'},
        {from: 'EUR', to: 'TRY'},
        {from: 'GBP', to: 'TRY'},
        {from: 'USD', to: 'EUR'}
    ];

    favoriteList.innerHTML='';

    popularPairs.forEach(pair => {
        if(exchangeRates[pair.from] && exchangeRates[pair.to]){
            
            //oran hesaplama
            const rate = exchangeRates[pair.to] / exchangeRates[pair.from];
            
            const div = document.createElement('div');
            div.className = 'favorite-item';
            div.innerHTML = `
            <div class="currency-pair">${pair.from}/${pair.to}</div>
            <div class="rate">${rate.toFixed(4)}</div>
            `;
            div.onclick = () => {
                fromCurrency.value = pair.from;
                toCurrency.value = pair.to;
                fetchRates(pair.from);
            };
            favoriteList.appendChild(div);
                 
        }
    });
}
//event listeners
amountInput.addEventListener('input', convertCurrency);
fromCurrency.addEventListener('change', () => fetchRates(fromCurrency.value));
toCurrency.addEventListener('change', swapCurrencies);
swapBtn.addEventListener('click',swapCurrencies);

//ilk yükleme
  fetchRates(fromCurrency.value);
});