// Variables to manage the calculator state
let currentInput = '';          // Current input being entered
let operator = '';              // Current operator selected
let operand1 = null;            // First operand for basic operations
let operand2 = null;            // Second operand for basic operations
let resultDisplayed = false;    // Flag to indicate if the result is currently displayed

// Variables for advanced functions
let advancedFunction = null;    // Current advanced function selected
let advancedInputs = [];        // Inputs collected for advanced functions
let expectedInputs = 0;         // Number of expected inputs for the advanced function
let inputPrompt = [];           // Prompts for each input in advanced functions

// Variable to store steps history
let stepsHistory = '';          // Stores the history of steps for all calculations

// Variable to store callback function for modal inputs
let modalCallback = null;       // Callback function to handle modal input

// Function to display the calculator section and hide the instructions section
function showCalculator() {
    document.getElementById('calculatorSection').style.display = 'block';
    document.getElementById('instructionsSection').style.display = 'none';
    document.getElementById('calculatorTab').classList.add('active');
    document.getElementById('instructionsTab').classList.remove('active');
}

// Function to display the instructions section and hide the calculator section
function showInstructions() {
    document.getElementById('calculatorSection').style.display = 'none';
    document.getElementById('instructionsSection').style.display = 'block';
    document.getElementById('calculatorTab').classList.remove('active');
    document.getElementById('instructionsTab').classList.add('active');
}

// Function to toggle the display of the steps section
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

// Function to reset the steps display to default when the calculator is cleared
function defaultSteps() {
    stepsHistory = ''; // Reset steps history
    const defaultSteps = "No steps to show yet. Perform a calculation to see steps.";
    document.getElementById("stepDetails").innerHTML = defaultSteps;
    document.getElementById('exportCsvButton').disabled = true; // Disable export button
}

// Function to handle number button clicks and update the display
function insertNumber(num) {
    if (resultDisplayed) {
        currentInput = '';
        resultDisplayed = false;
    }
    currentInput += num;
    updateDisplay(currentInput);
}

// Function to handle operator button clicks and set up the calculation
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

// Function to insert a decimal point into the current input
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

// Function to clear the display and reset all variables to default
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
    stepsHistory = ''; // Reset steps history
    updateDisplay('0');
    defaultSteps();
}

// Function to delete the last character from the current input
function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }
}

// Function to update the calculator's display with the given value
function updateDisplay(value) {
    document.getElementById("numbers").value = value;
}

// Function to display the result on the calculator's display
function displayResult(message) {
    document.getElementById("numbers").value = message;
    resultDisplayed = true;
}

// Function to display error messages using an alert
function showError(message) {
    alert(message);
}

// Function to retrieve and parse the advanced function inputs as numbers
function getNumbers() {
    return advancedInputs.map(Number).filter(num => !isNaN(num));
}

// Function to display prompts for advanced function inputs and update steps history
function showPrompt(message) {
    let promptMessage = `<p>${message}</p>`;
    stepsHistory += promptMessage;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
}

// Function to handle the 'Next' button during advanced function input
function nextInput() {
    if (advancedFunction && currentInput !== '') {
        advancedInputs.push(parseFloat(currentInput));
        stepsHistory += `<p>Entered number ${advancedInputs.length}: ${currentInput}</p>`;
        document.getElementById("stepDetails").innerHTML = stepsHistory;
        currentInput = '';
        updateDisplay('0');
        if (advancedInputs.length < expectedInputs) {
            showPrompt(inputPrompt[advancedInputs.length]);
        } else {
            showPrompt("Press '=' to calculate.");
        }
    }
}

// Function to calculate the result of the current operation or advanced function
function calculateResult() {
    if (advancedFunction) {
        if (currentInput !== '') {
            advancedInputs.push(parseFloat(currentInput));
            stepsHistory += `<p>Entered number ${advancedInputs.length}: ${currentInput}</p>`;
            document.getElementById("stepDetails").innerHTML = stepsHistory;
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

// Function to execute the appropriate advanced calculation based on advancedFunction variable
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
        case 'exponential':
            performExponentialFunction();
            break;
        default:
            break;
    }
}

// Function to display steps for basic arithmetic calculations
function showBasicCalculationSteps(op1, oper, op2, res) {
    let steps = `
        <hr>
        <p><strong>Calculation:</strong></p>
        <p>${op1} ${oper} ${op2} = ${res}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
}

// Advanced Functions

// Function to initiate square root calculation and prompt for input
function calculateSquareRoot() {
    advancedFunction = 'sqrt';
    advancedInputs = [];
    expectedInputs = 1;
    inputPrompt = ["Enter the number to find the square root of:"];
    showPrompt(inputPrompt[0]);
}

// Function to calculate the square root of the input and display steps
function performSquareRoot() {
    const [value] = getNumbers();
    if (value < 0) {
        showError("Cannot calculate the square root of a negative number.");
        return;
    }
    const result = sqrt_custom(value);
    displayResult(result.toFixed(4));

    let steps = `
        <hr>
        <p><strong>Square Root Calculation:</strong></p>
        <p>1. Entered value: ${value}</p>
        <p>2. Calculated √${value} = ${result.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to initiate square calculation and prompt for input
function calculateSquare() {
    advancedFunction = 'square';
    advancedInputs = [];
    expectedInputs = 1;
    inputPrompt = ["Enter the number to square:"];
    showPrompt(inputPrompt[0]);
}

// Function to calculate the square of the input and display steps
function performSquare() {
    const [value] = getNumbers();
    const result = square_custom(value);
    displayResult(result.toFixed(4));

    let steps = `
        <hr>
        <p><strong>Square Calculation:</strong></p>
        <p>1. Entered value: ${value}</p>
        <p>2. Calculated ${value}² = ${result.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to initiate power calculation and prompt for inputs
function calculatePower() {
    advancedFunction = 'power';
    advancedInputs = [];
    expectedInputs = 2;
    inputPrompt = ["Enter the base (x):", "Enter the exponent (y):"];
    showPrompt(inputPrompt[0]);
}

// Function to calculate the power (base^exponent) and display steps
function performPower() {
    const [base, exponent] = getNumbers();
    const result = power_custom(base, exponent);
    displayResult(result.toFixed(4));

    let steps = `
        <hr>
        <p><strong>Power Calculation:</strong></p>
        <p>1. Entered base: ${base}, Exponent: ${exponent}</p>
        <p>2. Calculated ${base}<sup>${exponent}</sup> = ${result.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to initiate logarithm calculation and prompt for inputs
function calculateLogarithm() {
    advancedFunction = 'log';
    advancedInputs = [];
    expectedInputs = 2;
    inputPrompt = ["Enter the value (x):", "Enter the base (b):"];
    showPrompt(inputPrompt[0]);
}

// Function to calculate the logarithm and display steps
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
        <hr>
        <p><strong>Logarithm Calculation:</strong></p>
        <p>1. Entered value: ${value}, Base: ${base}</p>
        <p>2. Calculated ln(${value}) ≈ ${logValue.toFixed(4)}</p>
        <p>3. Calculated ln(${base}) ≈ ${logBase.toFixed(4)}</p>
        <p>4. Computed log<sub>${base}</sub>(${value}) = ln(${value}) / ln(${base}) ≈ ${logResult.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = logResult.toString();
    resultDisplayed = true;
}

// Function to calculate Mean Absolute Deviation (MAD)
function calculateMAD() {
    advancedFunction = 'mad';
    advancedInputs = [];
    expectedInputs = 0; // Will be set after user input
    inputPrompt = [];
    showModal(
        "MAD Calculation",
        "How many numbers will you enter for MAD calculation?",
        handleMADInput
    );
}

// Function to handle the user input from the MAD modal and set up prompts
function handleMADInput(value) {
    expectedInputs = parseInt(value, 10);
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

// Function to calculate the Mean Absolute Deviation and display steps
function performMAD() {
    const numbers = getNumbers();
    const len = numbers.length;

    if (len === 0) {
        showError("Please enter valid number of values.");
        return;
    }

    // Calculating the mean
    let sum = 0;
    for (let i = 0; i < len; i++) {
        sum += numbers[i];
    }
    const mean = sum / len;

    // Calculate sum of absolute differences
    let sumAbsDiff = 0;
    for (let i = 0; i < len; i++) {
        let absDiff = absolute_custom(numbers[i] - mean);
        sumAbsDiff += absDiff;
    }

    // Calculating the Mean Absolute Deviation
    const mad = sumAbsDiff / len;

    displayResult(`MAD: ${mad.toFixed(4)}`);

    let steps = `
        <hr>
        <p><strong>Mean Absolute Deviation (MAD):</strong></p>
        <p>1. Entered values: ${numbers.join(', ')} (n = ${len})</p>
        <p>2. Calculated mean (μ): (${numbers.join(' + ')}) / ${len} = ${mean.toFixed(4)}</p>
        <p>3. Calculated sum of absolute differences: Σ|x - μ| = ${sumAbsDiff.toFixed(4)}</p>
        <p>4. MAD = Σ|x - μ| / n = ${sumAbsDiff.toFixed(4)} / ${len} = ${mad.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = mad.toString();
    resultDisplayed = true;
}

// Function to calculate Standard Deviation
function calculateStandardDeviation() {
    advancedFunction = 'stddev';
    advancedInputs = [];
    expectedInputs = 0; // Will be set after user input
    inputPrompt = [];
    showModal(
        "Standard Deviation Calculation",
        "How many numbers will you enter for Std Dev calculation?",
        handleStdDevInput
    );
}

// Function to handle the user input from the Standard Deviation modal and set up prompts
function handleStdDevInput(value) {
    expectedInputs = parseInt(value, 10);
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

// Function to calculate the Standard Deviation and display steps
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
        <hr>
        <p><strong>Standard Deviation:</strong></p>
        <p>1. Entered values: ${numbers.join(', ')} (n = ${len})</p>
        <p>2. Calculated mean (μ): (${numbers.join(' + ')}) / ${len} = ${mean.toFixed(4)}</p>
        <p>3. Calculated variance (Population): σ² = Σ(x - μ)² / n = ${varianceSum.toFixed(4)} / ${len} = ${variancePopulation.toFixed(4)}</p>
        <p>4. Calculated variance (Sample): s² = Σ(x - μ)² / (n - 1) = ${varianceSum.toFixed(4)} / ${len - 1} = ${varianceSample.toFixed(4)}</p>
        <p>5. Calculated standard deviation (Population): σ = √σ² = ${stdDevP.toFixed(4)}</p>
        <p>6. Calculated standard deviation (Sample): s = √s² = ${stdDevS.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = stdDevP.toString();
    resultDisplayed = true;
}

// Function to calculate Arccos
function calculateArccos() {
    advancedFunction = 'arccos';
    advancedInputs = [];
    expectedInputs = 3;
    inputPrompt = ["Enter side length a:", "Enter side length b:", "Enter side length c:"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Arccos calculation and display steps
function performArccos() {
    const [a, b, c] = getNumbers();
    const cosVal = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);

    // Approximate arccos using Taylor series expansion
    var arccosResult;
    var degrees;
    const sqrt2 = Math.SQRT2;
    const term = Math.sqrt(cosVal + 1);
    const term2 = Math.sqrt(1 - cosVal);

    if (cosVal < -1 || cosVal > 1) {
        showError("Invalid triangle. Please check your side lengths.");
        return;
    } else if (cosVal > 0.8 && cosVal <= 1) {
        const approxResult = 
            0 -
            (sqrt2 * term2) - 
            (term2 ** 3) / (6 * sqrt2) - 
            (3 * (term2 ** 5)) / (80 * sqrt2) - 
            (5 * (term2 ** 7)) / (448 * sqrt2);
        arccosResult = approxResult * (-1);
        degrees = radiansToDegrees_custom(arccosResult);
    } else if (cosVal >= -1 && cosVal < -0.8) {
        arccosResult = 
            Math.PI -
            (sqrt2 * term) -
            (term ** 3) / (6 * sqrt2) - 
            (3 * term ** 5) / (80 * sqrt2) - 
            (5 * term ** 7) / (448 * sqrt2);
        degrees = radiansToDegrees_custom(arccosResult);
    } else {
        arccosResult =
            Math.PI / 2 -
            cosVal -
            cosVal ** 3 / 6 -
            (3 * cosVal ** 5) / 40 -
            (5 * cosVal ** 7) / 112;
        degrees = radiansToDegrees_custom(arccosResult);
    }

    displayResult(degrees.toFixed(2) + '°');

    let steps = `
        <hr>
        <p><strong>Arccos Calculation:</strong></p>
        <p>1. Entered sides: a = ${a}, b = ${b}, c = ${c}</p>
        <p>2. Calculated cos(θ) using Law of Cosines:</p>
        <p>cos(θ) = (b² + c² - a²) / (2bc) = ${cosVal.toFixed(4)}</p>
        <p>3. Calculated θ = arccos(${cosVal.toFixed(4)}) = ${arccosResult.toFixed(4)} radians</p>
        <p>4. Converted to degrees: θ = ${degrees.toFixed(2)}°</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = degrees.toString();
    resultDisplayed = true;
}

// Function to initiate exponential function calculation and prompt for inputs
function calculateExponentialFunction() {
    advancedFunction = 'exponential';
    advancedInputs = [];
    expectedInputs = 3;
    inputPrompt = ["Enter the coefficient (a):", "Enter the base (b):", "Enter the exponent (x):"];
    showPrompt(inputPrompt[0]);
}

// Function to perform Exponential Function calculation and display steps
function performExponentialFunction() {
    const [a, b, x] = getNumbers();

    const powerResult = power_custom(b, x);
    const result = a * powerResult;
    displayResult(result.toFixed(4));

    let steps = `
        <hr>
        <p><strong>Exponential Function Calculation:</strong></p>
        <p>1. Entered coefficient a: ${a}, base b: ${b}, exponent x: ${x}</p>
        <p>2. Calculated ${b}<sup>${x}</sup> = ${powerResult.toFixed(4)}</p>
        <p>3. Calculated ${a} × ${powerResult.toFixed(4)} = ${result.toFixed(4)}</p>
    `;
    stepsHistory += steps;
    document.getElementById("stepDetails").innerHTML = stepsHistory;
    document.getElementById('exportCsvButton').disabled = false; // Enable export button
    currentInput = result.toString();
    resultDisplayed = true;
}

// Function to show the custom modal with title, message, and callback for input handling
function showModal(title, message, callback) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('modalInput').value = '';
    document.getElementById('modalInput').focus();
    document.getElementById('customModal').style.display = 'block';
    modalCallback = callback;
}

// Function to close the custom modal
function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

// Function to handle the OK button click on the modal and process the input
function handleModalOK() {
    const inputValue = document.getElementById('modalInput').value;
    if (modalCallback) {
        modalCallback(inputValue);
    }
    closeModal();
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

// Function to export calculations and steps to a CSV file
function exportToCSV() {
    // Prepare CSV content
    const csvContent = generateCSVContent(stepsHistory);
    
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Generate a filename with current date and time
    const date = new Date();
    const filename = `Calculator_Steps_${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate()
        .toString()
        .padStart(2, '0')}_${date.getHours()
        .toString()
        .padStart(2, '0')}${date.getMinutes()
        .toString()
        .padStart(2, '0')}${date.getSeconds()
        .toString()
        .padStart(2, '0')}.csv`;
    
    // Create a link to download the Blob as a file
    if (navigator.msSaveBlob) {
        // For IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
            // Feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Updated Function to generate CSV content from stepsHistory
function generateCSVContent(stepsHTML) {
    // Split stepsHTML into steps using <hr>
    const stepsArray = stepsHTML.split('<hr>');
    const csvRows = [];
    csvRows.push(['Step Number', 'Description']);

    let stepNumber = 1;

    stepsArray.forEach((stepHTML) => {
        if (stepHTML.trim()) {
            // Remove HTML tags to get plain text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = stepHTML;
            const stepText = tempDiv.textContent || tempDiv.innerText || '';
            // Clean up whitespace
            const stepDescription = stepText.replace(/[\n\r]+/g, ' ').trim();
            if (stepDescription) {
                csvRows.push([stepNumber, stepDescription]);
                stepNumber++;
            }
        }
    });

    // Convert the rows to CSV format
    const csvContent = csvRows.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    return csvContent;
}

// Initialize the calculator by displaying the calculator section
showCalculator();