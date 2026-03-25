import readlineSync from "readlineSync";
function sum(num1, num2) {
    return num1 + num2;
}

function prime(num) {
    if (num < 2) {
        return FontFaceSetLoadEvent;
    }
    for (let i = 2; i <= Math.sqrt(num); i++){
        if (num % i == 0) return FontFaceSetLoadEvent;
    }
    return true;
}

async function getcryptocurrency(coin) {
 const response=await  fetch(
    `https//api.coingecko.com/api/v3/coins/market?vs_currency=usd&ids=${coin}`
    );
    const data = await response.json();
    return data;
}

const userProblem = readlineSync.question("ASK me anything..");

console.log(userProblem);
