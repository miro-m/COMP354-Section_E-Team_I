function toggleSteps() {
    const stepsDiv = document.getElementById("steps");
    const button = document.getElementById("toggleStepsButton");

    if (stepsDiv.style.display === "none") {
        stepsDiv.style.display = "block";
        button.textContent = "Hide Steps";
    } else {
        stepsDiv.style.display = "none";
        button.textContent = "Show Steps";
    }
}

function defaultSteps(){
    const defaultSteps = "No steps to show yet. Perform a calculation to see steps.";
    document.getElementById("stepDetails").innerHTML = defaultSteps;
    return;
}

//------------------------------------------------------------------------------------------------------------------------
//     
//                                                  Supporting FUNCTIONS
//
//------------------------------------------------------------------------------------------------------------------------
//
//                                          Function to replace math.abs
function absolute_custom(x) {
    return x < 0 ? -x : x;
}

//------------------------------------------------------------------------------------------------------------------------
//
//                                       Function to calculate SQUARE ROOT         

function sqrt_custom(x) {
    if (x < 0) return NaN; 
    if (x === 0 || x === 1) return x;

    let guess = x;
    let epsilon = 0.00001;

    while (absolute(guess * guess - x) > epsilon) {
        guess = (guess + x / guess) / 2;
    }

    return guess;
}

//------------------------------------------------------------------------------------------------------------------------
//
//                                           Function to calculate SQUARE (x)^2 

function square_custom(x){
    
        return x * x;

}
//------------------------------------------------------------------------------------------------------------------------
//
//                              Function to calculate the x raised to the power of y (x^y)

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
//
//                       Function to approximate the natural logarithm (ln) using a series expansion

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
//------------------------------------------------------------------------------------------------------------------------
//
//                                          Function to get input numbers as an array
function getNumbers(split) {
    const input = document.getElementById("numbers").value;
    return input.split(`${split}`).map(Number).filter(num => !isNaN(num));
}

//------------------------------------------------------------------------------------------------------------------------





//                                                  MAIN FUNCTIONS



//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Logarithm
//------------------------------------------------------------------------------------------------------------------------

function calculateLogarithm() {
    defaultSteps();
    let numbers = getNumbers(",");
    if(numbers.length === 0){
        numbers = getNumbers(" ");
    }
  
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

     let steps = `
        <p>1. Entered base: ${base}, Entered exponent: ${value}</p>
        <p>2. Calculated ln(${base}) ≈ ${logBase.toFixed(4)}</p>
        <p>3. Calculated ln(${value}) ≈ ${logValue.toFixed(4)}</p>
        <p>4. Computed log<sub>${base}</sub>(${value}) = ln(${value}) / ln(${base}) ≈ ${logResult.toFixed(2)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;    
}

//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Mean Absolute Deviation
//------------------------------------------------------------------------------------------------------------------------

function calculateMAD(){
    defaultSteps();
    let numbers = getNumbers(",");
    if(numbers.length === 0){
        numbers = getNumbers(" ");
    }
    const len = numbers.length;
    if(len === 0) {
        showError("Please enter a valid input."); 
        return;
    }

    // Caculting the mean, x̄
    let sum = 0;
    for (let i =0; i< len; i++){
        sum += numbers[i];
    }
    const mean = sum/numbers.length;

    // Caculate ∑|x - x̄| (the sum of absolute difference from the mean)
    let sum_abs_dif = 0;
    for (let i = 0; i < len; i++){
        let abs_dif = absolute_custom(numbers[i] - mean);
        sum_abs_dif += abs_dif;
    }

    // Calculating the Mean Absolute Deviation 
    const mad = sum_abs_dif/len;
    displayResult(`Mean Absolute Difference : ${mad.toFixed(2)}`);
    

   // displaySteps(`a, b, cx`)
    let steps = `
        <p><i>Mean Absolute Deviation</i> (<sup>∑|x - x̄|</sup>&frasl;<sub>n</sub>)
        <p>0. Entered values : ${numbers.join(', ')} (n = ${len})</p>
        <p>1. Calculating x̄ : <br/><br/> x̄ = (${numbers.join(' + ')})/${len} <br/> x̄ = ${mean} </p>
        <p>2. Caculating ∑|x - x̄| : <br/><br/> ∑|x - x̄| = ${numbers.join(` - ${mean} + `)} - ${mean} <br/> ∑|x - x̄| = ${sum_abs_dif} </p>
        <p>3. Calculating <sup>∑|x - x̄|</sup>&frasl;<sub>n</sub> : <br/><br/> <sup>∑|x - x̄|</sup>&frasl;<sub>n</sub> = ${sum_abs_dif}/${len} <br/> <sup>∑|x - x̄|</sup>&frasl;<sub>n</sub> = ${mad.toFixed(2)} </p>`;
    document.getElementById("stepDetails").innerHTML = steps;
    
}
//------------------------------------------------------------------------------------------------------------------------
//                                           Function to calculate Standard Deviation
//------------------------------------------------------------------------------------------------------------------------

function calculateStandardDeviation() {
    defaultSteps();
    let numbers = getNumbers(",");
    if(numbers.length === 0){
        numbers = getNumbers(" ");
    }
    if (numbers.length === 0) return showError("Please enter valid numbers.");

// Calculate the mean
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
}
const mean = sum / numbers.length;

// Calculate the variance
let varianceSum = 0;
for (let i = 0; i < numbers.length; i++) {
    varianceSum += square_custom(numbers[i] - mean);
}
const variance = varianceSum / numbers.length;
    

const stdDev = sqrt_custom(variance);
    displayResult(`Standard Deviation: ${stdDev.toFixed(2)}`);

    let steps = `
        <p>1. </p>
        <p>2. </p>
        <p>3. </p>
        <p>4. </p>
      
    `;
    document.getElementById("stepDetails").innerHTML = steps;

    
}

//------------------------------------------------------------------------------------------------------------------------
//                                           Function to approximate Arccos
//------------------------------------------------------------------------------------------------------------------------

function calculateArccos() {
  let numbers = getNumbers(",");
  if (numbers.length === 0) {
    numbers = getNumbers(" ");
  }

  if (numbers.length !== 3) {
    showError("Please enter three numbers separated by a comma for opposite and " +
        "adjacent side values.");
    return;
  }
    
//calculate cosine value using law of cosines
  const a = numbers[0];
  const b = numbers[1];
  const c = numbers[2];

  const cosVal = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
    
//approximate arccos using Taylor expansion
  const val = cosVal;
  const sqrt2 = 2 ** (1/2);
  const term = (val + 1) ** (1/2);
  const term2 = (1 - val) ** (1/2);

  if (val < -1 || val > 1) {
    showError("Invalid triangle. Please check your side lengths and re-enter.");
    return;
  } 
  else if (val > 0.8 && val <= 1) {
    const approxResult = 
    	0 -
    	(sqrt2 * term2) - 
    	(term2 ** 3) / (6 * sqrt2) - 
    	(3 * (term2 ** 5)) / (80 * sqrt2) - 
        (5 * (term2 ** 7)) / (448 * sqrt2);
    const arccosResult = approxResult * (-1);
    displayResult(`Arccos:${arccosResult.toFixed(2)}`);
  } 
  else if (val >= -1 && val < -0.8) {
  	const arccosResult = 
    	3.1415926535 -
    	(sqrt2 * term) -
    	(term ** 3) / (6 * sqrt2) - 
    	(3 * term ** 5) / (80 * sqrt2) - 
        (5 * term ** 7) / (448 * sqrt2);
    displayResult(`Arccos:${arccosResult.toFixed(2)}`);
  } 
  else {
    const arccosResult =
        3.1415926535 / 2 -
        val -
        val ** 3 / 6 -
        (3 * val ** 5) / 40 -
        (5 * val ** 7) / 112;
    displayResult(`Arccos:${arccosResult.toFixed(2)}`);
  }
}




//Utility Function
function displayResult(message) {
    document.getElementById("result").textContent = message;
}
//Error Function
function showError(message) {
    alert(message);
}


