const btn = document.querySelectorAll('td > input');
const btnResult = document.querySelector('td > input[value="="]')
const clearBtn = document.querySelector('td > input[value="c"]')
const results = document.getElementById('result')
const deleteBtn = document.querySelector('td > input[value="<="]')
let calculation = '';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

clearBtn.addEventListener('click', () => {
    results.value = '';
    calculation = '';
});

btn.forEach((e, i) => {
    if (e.value !== "=" && e.value !== "c" && e.value !== '<=') {
        e.addEventListener('click', () => {
            results.value += e.value;
            calculation += e.value;
        });
    }
});

function calculate(operator, operand1, operand2) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            if (operand2 === 0) {
                return "Error: Division by zero";
            }
            return operand1 / operand2;
        default:
            return "Invalid operator";
    }
}

function evaluateExpression(expression) {
    const operators = ['+', '-', '*', '/'];
    const outputQueue = [];
    const operatorStack = [];

    const tokens = expression.match(/(\d+|\+|-|\*|\/)/g);

    tokens.forEach(token => {
        if (!isNaN(token)) { 
            outputQueue.push(parseFloat(token));
        } else if (operators.includes(token)) {
            while (operatorStack.length > 0 && operators.indexOf(token) <= operators.indexOf(operatorStack[operatorStack.length - 1])) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    const evalStack = [];
    outputQueue.forEach(token => {
        if (!isNaN(token)) {
            evalStack.push(token);
        } else {
            const operand2 = evalStack.pop();
            const operand1 = evalStack.pop();
            const result = calculate(token, operand1, operand2);
            evalStack.push(result);
        }
    });

    return evalStack[0];
}

deleteBtn.addEventListener('click', () => {
    results.value = results.value.slice(0, -1);
    calculation = calculation.slice(0, -1);
});

btnResult.addEventListener('click', () => {
    const expression = calculation;
    const result = evaluateExpression(expression);

    console.log(expression);
    console.log(result);
    results.value = result;
});

