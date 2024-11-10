// Function to get input numbers as an array
function getNumbers() {
    const input = document.getElementById("numbers").value;
    return input.split(",").map(Number).filter(num => !isNaN(num));
}



//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Logarithm
//------------------------------------------------------------------------------------------------------------------------

function calculateLogarithm() {
    const numbers = getNumbers();
  
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

    const logResult = Math.log(value) / Math.log(base); 
    displayResult(`Logarithm:${logResult.toFixed(2)}`);
}



//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Standard Deviation
//------------------------------------------------------------------------------------------------------------------------

function calculateStandardDeviation() {
    const numbers = getNumbers();
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
