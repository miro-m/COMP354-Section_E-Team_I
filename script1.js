// Function to get input numbers as an array
function getNumbers(split) {
    const input = document.getElementById("numbers").value;
    return input.split(`${split}`).map(Number).filter(num => !isNaN(num)); // returns an array of Numbers (filters out non nurmerical values)
}



//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Logarithm
//------------------------------------------------------------------------------------------------------------------------

function calculateLogarithm() {
    const numbers = getNumbers(",");
  
    if (numbers.length !== 2) {
        showError("Please enter two numbers separated by a comma for base and value.");
        return;
    }

    const base = numbers[0];
    const value = numbers[1];

    if (base <= 0 || base === 1 || value <= 0) {
        showError("Invalid input. Ensure base > 0, base ≠ 1, and value > 0.");
        return;
    }

    const logBase = approximateLog(base);
    const logValue = approximateLog(value);

    const logResult = logValue / logBase;
    displayResult(`Logarithm: ${logResult.toFixed(2)}`);
}

// This method approximates the natural logarithm (ln) using a series expansion
function approximateLog(x) {
    if (x <= 0) return NaN;
    if (x === 1) return 0;

    let result = 0;
    const n = 10000; 
    const y = (x - 1) / (x + 1);

    for (let i = 0; i < n; i++) {
        const term = (2 / (2 * i + 1)) * Power(y, 2 * i + 1);
        result += term;
    }

    return result;
}

// This method manually calculates exponential numbers
function Power(base, exponent) {
    let result = 1;
    let currentBase = base;
    let currentExponent = exponent;

    if (currentExponent < 0) {
        currentExponent = -currentExponent;
        for (let i = 0; i < currentExponent; i++) {
            result *= currentBase;
        }
        result = 1 / result;
    } else {
        for (let i = 0; i < currentExponent; i++) {
            result *= currentBase;
        }
    }

    return result;
}
//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Mean Absolute Deviation
//------------------------------------------------------------------------------------------------------------------------

function calculateMAD(){
    let numbers = getNumbers(",");
    if(numbers.length ===0 || numbers.length <0){
        numbers = getNumbers(" ");
    }
    const len = numbers.length;
    if(len === 0) return showError("Please enter a valid input.");
    let sum = 0;
    for (let i =0; i< len; i++){
        sum += numbers[i];
    }
    const mean = sum/numbers.length;

    let abs_diff= 0;
    for (let i = 0; i< len; i++){
        let dif = numbers[i] - mean;
        if (dif<0){
            dif*=-1
        }
        abs_diff += dif
    }

    const mad = abs_diff/len
    displayResult(`Mean Absolute Difference : ${mad.toFixed(2)}`)
    displaySteps(`a, b, cx`)

    }
    

//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Standard Deviation
//------------------------------------------------------------------------------------------------------------------------

function calculateStandardDeviation() {
    const numbers = getNumbers(",");
    if (numbers.length === 0) return showError("Please enter valid numbers.");
    const mean = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    displayResult(`Standard Deviation: ${stdDev.toFixed(2)}`);
}


//Utility Function
function displayResult(message) {
    document.getElementById("result").textContent = message;
}
//Error Function
function showError(message) {
    alert(message);
}

function displaySteps(message){
    document.getElementById("steps").textContent = message;
}

function showSteps(){
    document.getElementById("steps").style.visibility = "visibile";
}

function hideSteps(){
    document.getElementById("steps").style.visibility = "hidden";
}


