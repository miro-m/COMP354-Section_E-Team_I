// Variables to manage the calculator state
let currentInput = '';
let operator = '';
let operand1 = null;
let operand2 = null;
let resultDisplayed = false;

// Variables for advanced functions
let advancedFunction = null;
let advancedInputs = [];
let expectedInputs = 0;
let inputPrompt = [];

// Function to show calculator section
function showCalculator() {
    document.getElementById('calculatorSection').style.display = 'block';
    document.getElementById('instructionsSection').style.display = 'none';
    document.getElementById('calculatorTab').classList.add('active');
    document.getElementById('instructionsTab').classList.remove('active');
}

// Function to show instructions section
function showInstructions() {
    document.getElementById('calculatorSection').style.display = 'none';
    document.getElementById('instructionsSection').style.display = 'block';
    document.getElementById('calculatorTab').classList.remove('active');
    document.getElementById('instructionsTab').classList.add('active');
}

// Function to toggle the display of steps
function toggleSteps() {
    const stepsDiv = document.getElementById("steps");
    const button = document.getElementById("toggleStepsButton");

    if (stepsDiv.style.display === "none" || stepsDiv.style.display === "") {
        stepsDiv.style.display = "block";
        button.textContent = "Hide Steps";
    } else {
        stepsDiv.style.display = "none";
        button.textContent = "Show Steps";
    }
}

// Function to reset the steps display
function defaultSteps() {
    const defaultSteps = "No steps to show yet. Perform a calculation to see steps.";
    document.getElementById("stepDetails").innerHTML = defaultSteps;
}

// Function to insert numbers into the display
function insertNumber(num) {
    if (resultDisplayed) {
        currentInput = '';
        resultDisplayed = false;
    }
    currentInput += num;
    updateDisplay(currentInput);
}

// Function to insert operators into the calculation
function insertOperator(op) {
    if (advancedFunction) {
        // Ignore operator inputs during advanced function input
        return;
    }
    if (operator && currentInput) {
        calculateResult();
    }
    operand1 = parseFloat(currentInput);
    operator = op;
    currentInput = '';
}

// Function to insert decimal point
function insertDecimal() {
    if (!currentInput.includes('.')) {
        if (currentInput === '') {
            currentInput = '0.';
        } else {
            currentInput += '.';
        }
        updateDisplay(currentInput);
    }
}

// Function to clear the display and reset variables
function clearDisplay() {
    currentInput = '';
    operator = '';
    operand1 = null;
    operand2 = null;
    resultDisplayed = false;
    advancedFunction = null;
    advancedInputs = [];
    expectedInputs = 0;
    inputPrompt = [];
    updateDisplay('0');
    defaultSteps();
}

// Function to delete the last character
function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }
}

// Function to update the display
function updateDisplay(value) {
    document.getElementById("numbers").value = value;
}

// Function to display results
function displayResult(message) {
    document.getElementById("numbers").value = message;
    resultDisplayed = true;
}

// Error Function
function showError(message) {
    alert(message);
}

// Function to get input numbers as an array
function getNumbers() {
    return advancedInputs.map(Number).filter(num => !isNaN(num));
}

// Function to handle prompts for advanced functions
function showPrompt(message) {
    document.getElementById("stepDetails").innerHTML = `<p>${message}</p>`;
}

// Function for 'Next' button to collect inputs for advanced functions
function nextInput() {
    if (advancedFunction && currentInput !== '') {
        advancedInputs.push(parseFloat(currentInput));
        currentInput = '';
        updateDisplay('0');
        if (advancedInputs.length < expectedInputs) {
            showPrompt(inputPrompt[advancedInputs.length]);
        } else {
            showPrompt("Press '=' to calculate.");
        }
    }
}

// Modify calculateResult to handle advanced functions
function calculateResult() {
    if (advancedFunction) {
        if (currentInput !== '') {
            advancedInputs.push(parseFloat(currentInput));
            currentInput = '';
        }
        if (advancedInputs.length === expectedInputs) {
            performAdvancedCalculation();
            advancedFunction = null;
            advancedInputs = [];
            expectedInputs = 0;
            inputPrompt = [];
        } else {
            showError(`Expected ${expectedInputs} inputs, but got ${advancedInputs.length}.`);
        }
    } else if (operator && currentInput) {
        operand2 = parseFloat(currentInput);
        let result;

        switch (operator) {
            case '+':
                result = operand1 + operand2;
                break;
            case '−':
            case '-':
                result = operand1 - operand2;
                break;
            case '×':
            case '*':
                result = operand1 * operand2;
                break;
            case '÷':
            case '/':
                if (operand2 === 0) {
                    showError("Cannot divide by zero");
                    clearDisplay();
                    return;
                }
                result = operand1 / operand2;
                break;
            default:
                return;
        }

        updateDisplay(result);
        showBasicCalculationSteps(operand1, operator, operand2, result);
        currentInput = result.toString();
        operand1 = result;
        operator = '';
        resultDisplayed = true;
    }
}

// Function to perform advanced calculations
function performAdvancedCalculation() {
    switch (advancedFunction) {
        case 'sqrt':
            performSquareRoot();
            break;
        case 'square':
            performSquare();
            break;
        case 'power':
            performPower();
            break;
        case 'log':
            performLogarithm();
            break;
        case 'mad':
            performMAD();
            break;
        case 'stddev':
            performStandardDeviation();
            break;
        case 'arccos':
            performArccos();
            break;
        default:
            break;
    }
}

// Function to show steps for basic calculations
function showBasicCalculationSteps(op1, oper, op2, res) {
    let steps = `
        <p><strong>Calculation:</strong></p>
        <p>${op1} ${oper} ${op2} = ${res}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
}

// Advanced Functions

// Function to calculate Square Root
function calculateSquareRoot() {
    defaultSteps();
    advancedFunction = 'sqrt';
    advancedInputs = [];
    expectedInputs = 1;
    inputPrompt = ["Enter the number to find the square root of:"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Square Root calculation
function performSquareRoot() {
    const [value] = getNumbers();
    if (value < 0) {
        showError("Cannot calculate the square root of a negative number.");
        return;
    }
    const result = sqrt_custom(value);
    displayResult(result.toFixed(4));

    let steps = `
        <p><strong>Square Root Calculation:</strong></p>
        <p>1. Entered value: ${value}</p>
        <p>2. Calculated √${value} = ${result.toFixed(4)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to calculate Square
function calculateSquare() {
    defaultSteps();
    advancedFunction = 'square';
    advancedInputs = [];
    expectedInputs = 1;
    inputPrompt = ["Enter the number to square:"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Square calculation
function performSquare() {
    const [value] = getNumbers();
    const result = square_custom(value);
    displayResult(result.toFixed(4));

    let steps = `
        <p><strong>Square Calculation:</strong></p>
        <p>1. Entered value: ${value}</p>
        <p>2. Calculated ${value}² = ${result.toFixed(4)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to calculate Power
function calculatePower() {
    defaultSteps();
    advancedFunction = 'power';
    advancedInputs = [];
    expectedInputs = 2;
    inputPrompt = ["Enter the base (x):", "Enter the exponent (y):"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Power calculation
function performPower() {
    const [base, exponent] = getNumbers();
    const result = power_custom(base, exponent);
    displayResult(result.toFixed(4));

    let steps = `
        <p><strong>Power Calculation:</strong></p>
        <p>1. Entered base: ${base}, Exponent: ${exponent}</p>
        <p>2. Calculated ${base}<sup>${exponent}</sup> = ${result.toFixed(4)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to calculate Logarithm
function calculateLogarithm() {
    defaultSteps();
    advancedFunction = 'log';
    advancedInputs = [];
    expectedInputs = 2;
    inputPrompt = ["Enter the value (x):", "Enter the base (b):"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Logarithm calculation
function performLogarithm() {
    const [value, base] = getNumbers();

    if (base <= 0 || base === 1 || value <= 0) {
        showError("Invalid input. Ensure base > 0, base ≠ 1, and value > 0.");
        return;
    }

    const logBase = approximateLog_custom(base);
    const logValue = approximateLog_custom(value);

    const logResult = logValue / logBase;
    displayResult(logResult.toFixed(4));

    let steps = `
        <p><strong>Logarithm Calculation:</strong></p>
        <p>1. Entered value: ${value}, Base: ${base}</p>
        <p>2. Calculated ln(${value}) ≈ ${logValue.toFixed(4)}</p>
        <p>3. Calculated ln(${base}) ≈ ${logBase.toFixed(4)}</p>
        <p>4. Computed log<sub>${base}</sub>(${value}) = ln(${value}) / ln(${base}) ≈ ${logResult.toFixed(4)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = logResult.toString();
    resultDisplayed = true;
}

// Function to calculate Mean Absolute Deviation (MAD)
function calculateMAD() {
    defaultSteps();
    advancedFunction = 'mad';
    advancedInputs = [];
    expectedInputs = parseInt(prompt("How many numbers will you enter for MAD calculation?"), 10);
    if (isNaN(expectedInputs) || expectedInputs <= 0) {
        showError("Invalid number of inputs.");
        clearDisplay();
        return;
    }
    inputPrompt = [];
    for (let i = 0; i < expectedInputs; i++) {
        inputPrompt.push(`Enter number ${i + 1}:`);
    }
    showPrompt(inputPrompt[0]);
}

// Function to perform MAD calculation
function performMAD() {
    const numbers = getNumbers();
    const len = numbers.length;


    if (len === 0) {
        showError("Please enter valid number of values.");
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

    displayResult(`MAD: ${mad.toFixed(4)}`);

    let steps = `
        <p><strong>Mean Absolute Deviation (MAD):</strong></p>
        <p>1. Entered values: ${numbers.join(', ')} (n = ${len})</p>
        <p>2. Calculated mean (μ): (${numbers.join(' + ')}) / ${len} = ${mean.toFixed(4)}</p>
        <p>3. Calculated sum of absolute differences: Σ|x - μ| = ${sumAbsDiff.toFixed(4)}</p>
        <p>4. MAD = Σ|x - μ| / n = ${sumAbsDiff.toFixed(4)} / ${len} = ${mad.toFixed(4)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = mad.toString();
    resultDisplayed = true;
}

// Function to calculate Standard Deviation
function calculateStandardDeviation() {
    defaultSteps();
    advancedFunction = 'stddev';
    advancedInputs = [];
    expectedInputs = parseInt(prompt("How many numbers will you enter for Std Dev calculation?"), 10);
    if (isNaN(expectedInputs) || expectedInputs <= 0) {
        showError("Invalid number of inputs.");
        clearDisplay();
        return;
    }
    inputPrompt = [];
    for (let i = 0; i < expectedInputs; i++) {
        inputPrompt.push(`Enter number ${i + 1}:`);
    }
    showPrompt(inputPrompt[0]);
}

// Function to perform Standard Deviation calculation
function performStandardDeviation() {
    const numbers = getNumbers();
    const len = numbers.length;

    if (len === 0) {
        showError("Please enter valid numbers.");
        return;
    }

    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / len;
    const varianceSum = numbers.reduce((acc, num) => acc + square_custom(num - mean), 0);
    const variancePopulation = varianceSum / len;
    const varianceSample = varianceSum / (len - 1);
    const stdDevP = sqrt_custom(variancePopulation);
    const stdDevS = sqrt_custom(varianceSample);

    displayResult(`σ: ${stdDevP.toFixed(4)}, s: ${stdDevS.toFixed(4)}`);

    let steps = `
        <p><strong>Standard Deviation:</strong></p>
        <p>1. Entered values: ${numbers.join(', ')} (n = ${len})</p>
        <p>2. Calculated mean (μ): (${numbers.join(' + ')}) / ${len} = ${mean.toFixed(4)}</p>
        <p>3. Calculated variance (Population): σ² = Σ(x - μ)² / n = ${varianceSum.toFixed(4)} / ${len} = ${variancePopulation.toFixed(4)}</p>
        <p>4. Calculated variance (Sample): s² = Σ(x - μ)² / (n - 1) = ${varianceSum.toFixed(4)} / ${len - 1} = ${varianceSample.toFixed(4)}</p>
        <p>5. Calculated standard deviation (Population): σ = √σ² = ${stdDevP.toFixed(4)}</p>
        <p>6. Calculated standard deviation (Sample): s = √s² = ${stdDevS.toFixed(4)}</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = stdDevP.toString();
    resultDisplayed = true;
}

// Function to calculate Arccos
function calculateArccos() {
    defaultSteps();
    advancedFunction = 'arccos';
    advancedInputs = [];
    expectedInputs = 3;
    inputPrompt = ["Enter side length a:", "Enter side length b:", "Enter side length c:"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Arccos calculation
function performArccos() {
    const [a, b, c] = getNumbers();
    const cosVal = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);

    //approximate arccos using Taylor expansion
    var arccosResult;
    var degrees;
    const sqrt2 = 2 ** (1/2);
    const term = (cosVal + 1) ** (1/2);
    const term2 = (1 - cosVal) ** (1/2);

    if (cosVal < -1 || cosVal > 1) {
        showError("Invalid triangle. Please check your side lengths.");
        return;
    }
    else if (cosVal > 0.8 && cosVal <= 1) {
        const approxResult = 
            0 -
            (sqrt2 * term2) - 
            (term2 ** 3) / (6 * sqrt2) - 
            (3 * (term2 ** 5)) / (80 * sqrt2) - 
          (5 * (term2 ** 7)) / (448 * sqrt2);
        arccosResult = approxResult * (-1);
        degrees = radiansToDegrees_custom(arccosResult);
      } 
      else if (cosVal >= -1 && cosVal < -0.8) {
          arccosResult = 
            3.1415926535 -
            (sqrt2 * term) -
            (term ** 3) / (6 * sqrt2) - 
            (3 * term ** 5) / (80 * sqrt2) - 
          (5 * term ** 7) / (448 * sqrt2);
        degrees = radiansToDegrees_custom(arccosResult);
      } 
      else {
        arccosResult =
          3.1415926535 / 2 -
          cosVal -
          cosVal ** 3 / 6 -
          (3 * cosVal ** 5) / 40 -
          (5 * cosVal ** 7) / 112;
        degrees = radiansToDegrees_custom(arccosResult);
      }

    displayResult(degrees.toFixed(4) + '°');

    let steps = `
        <p><strong>Arccos Calculation:</strong></p>
        <p>1. Entered sides: a = ${a}, b = ${b}, c = ${c}</p>
        <p>2. Calculated cos(θ) using Law of Cosines:</p>
        <p>cos(θ) = (b² + c² - a²) / (2bc) = ${cosVal.toFixed(4)}</p>
        <p>3. Calculated θ = arccos(${cosVal.toFixed(4)}) = ${arccosResult.toFixed(4)} radians</p>
        <p>4. Converted to degrees: θ = ${degrees.toFixed(4)}°</p>
    `;
    document.getElementById("stepDetails").innerHTML = steps;
    currentInput = degrees.toString();
    resultDisplayed = true;
}

// Supporting Functions

// Function to replace Math.abs
function absolute_custom(x) {
    return x < 0 ? -x : x;
}

// Function to calculate square root
function sqrt_custom(x) {
    if (x < 0) return NaN;
    if (x === 0 || x === 1) return x;

    let guess = x;
    let epsilon = 0.00001;

    while (absolute_custom(guess * guess - x) > epsilon) {
        guess = (guess + x / guess) / 2;
    }

    return guess;
}

// Function to calculate x raised to the power y
function power_custom(base, exponent) {
    let result = 1;
    let isNegativeExponent = exponent < 0;
    let currentExponent = absolute_custom(exponent);

    for (let i = 0; i < currentExponent; i++) {
        result *= base;
    }

    if (isNegativeExponent) {
        result = 1 / result;
    }

    return result;
}

// Function to approximate natural logarithm (ln)
function approximateLog_custom(x) {
    if (x <= 0) return NaN;
    if (x === 1) return 0;

    let result = 0;
    const n = 10000;
    const y = (x - 1) / (x + 1);

    for (let i = 0; i < n; i++) {
        const term = (2 / (2 * i + 1)) * power_custom(y, 2 * i + 1);
        result += term;
    }

    return result;
}

// Function to convert radians to degrees
function radiansToDegrees_custom(rads) {
    return rads * (180 / Math.PI);
}

// Function to calculate square of a number (x^2)
function square_custom(x) {
    return x * x;
}

// Initialize by showing the calculator
showCalculator();