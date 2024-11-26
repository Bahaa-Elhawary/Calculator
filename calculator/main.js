// Selectors for the screen and all buttons
const screen = document.querySelector('.screen');
const buttons = document.querySelectorAll('button');

// Variables to store the current input, previous input, operator, and calculation string
let currentInput = '';
let previousInput = '';
let operator = null;
let calculationString = ''; // This will store the ongoing operation

// Update the screen display
function updateScreen(value) {
    screen.innerText = value || '0'; // Display '0' if value is empty
}

// Clear all inputs and reset the calculator
function clearCalculator() {
    currentInput = '';
    previousInput = '';
    operator = null;
    calculationString = '';
    updateScreen('0');
}

// Change the sign of the current input
function toggleSign() {
    if (currentInput) {
        currentInput = String(-parseFloat(currentInput));
        updateScreen(calculationString + currentInput);
    }
}

// Perform the calculation based on the selected operator
function calculate() {
    if (operator && previousInput !== '' && currentInput !== '') {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result = 0;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case 'x':
                result = prev * current;
                break;
            case '/':
                result = current === 0 ? 'Error' : prev / current;
                break;
            case '%':
                result = current === 0 ? 'Error' : prev % current; // Modulus operation
                break;
            default:
                return;
        }

        // Clear the operation from the screen before displaying the result
        calculationString = '';
        updateScreen(result);

        // Reset inputs for the next calculation
        currentInput = String(result);
        previousInput = '';
        operator = null;
    }
}

// Handle the delete operation
function handleDelete() {
    if (currentInput) {
        currentInput = currentInput.slice(0, -1); // Remove the last character
        calculationString = calculationString.slice(0, -1); // Remove from the calculation string
        updateScreen(calculationString || '0'); // Update the screen
    }
}

// Function to handle button presses
function handleButtonPress(value) {
    if (!isNaN(value) || value === '.') {
        // Append numbers and decimals
        if (value === '.' && currentInput.includes('.')) return; // Prevent multiple decimals
        currentInput += value;
        calculationString += value; // Add to the calculation string
        updateScreen(calculationString);
    } else if (value === 'AC') {
        // Clear the calculator
        clearCalculator();
    } else if (value === '+/') {
        // Toggle sign
        toggleSign();
    } else if (value === '%') {
        // Handle modulus
        if (currentInput !== '') {
            if (previousInput !== '') {
                calculate(); // Calculate result if chaining operations
            }
            previousInput = currentInput;
            currentInput = '';
        }
        operator = '%';
        calculationString += ' % '; // Update the calculation string
        updateScreen(calculationString);
    } else if (value === '=') {
        // Perform calculation
        calculate();
    } else if (value === 'Del') {
        // Handle delete
        handleDelete();
    } else if (['+', '-', 'x', '/'].includes(value)) {
        // Handle operators
        if (currentInput !== '') {
            if (previousInput !== '') {
                calculate(); // Calculate the result for chained operations
            }
            previousInput = currentInput;
            currentInput = '';
        }
        operator = value;
        calculationString += ` ${value} `; // Update the calculation string
        updateScreen(calculationString);
    }
}

// Add event listeners for button clicks
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const value = button.innerText;
        handleButtonPress(value);
    });
});

// Add event listener for keyboard input
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key) || key === '.') {
        // Handle number or decimal point
        handleButtonPress(key);
    } else if (key === 'Enter' || key === '=') {
        // Handle Enter key as "="
        handleButtonPress('=');
    } else if (key === 'Backspace') {
        // Handle Backspace to delete the last digit
        handleDelete();
    } else if (key === 'Escape') {
        // Handle Escape key as "AC"
        handleButtonPress('AC');
    } else if (key === '+') {
        handleButtonPress('+');
    } else if (key === '-') {
        handleButtonPress('-');
    } else if (key === '*') {
        handleButtonPress('x');
    } else if (key === '/') {
        handleButtonPress('/');
    } else if (key === '%') {
        handleButtonPress('%');
    }
});
