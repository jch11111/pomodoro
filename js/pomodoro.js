var calc = (function () {

    var total = 0,
        currentEntry = {
            wholeAmount: 0,
            decimalAmount: 0,
            powerOfTen: null,
            decimalMode: false,
            isOperationsOnly: false,
            operationsNotAllowed: false,
            numberOfTrailingDecimalZeros: 0,
            toString: function () {
                var amt = this.amount,
                    output;
                if (this.numberOfDecimalDigits > 10) {
                    amt = Math.round10(amt, -10);
                }

                if (this.numberOfDigits > MAX_DIGITS) {
                    amt = amt.toExponential(4);
                }

                output = amt.toString();

                if (this.numberOfTrailingDecimalZeros && output.indexOf('.') === -1) {
                    output += '.';
                }
                return output + '0'.repeat(this.numberOfTrailingDecimalZeros);
            }
        },
        operationStack = [],
        operatorSymbols = {
            add: '+',
            subtract: '-',
            multiply: '×',
            divide: '÷',
            equals: '='
        },
        inifinitySymbol = '\u221E',
        MAX_DIGITS = 14;

    function calculateStack() {
        var runningTotal = operationStack[0];

        for (var stackItem = 1; stackItem < operationStack.length; stackItem += 2) {
            runningTotal = mathOperation(operationStack[stackItem], runningTotal, operationStack[stackItem + 1]);
        }

        return runningTotal;
    }

    function createCurrentEntrySettersGetters() {
        if (!currentEntry) {
            throw ('currentEntry does not exist');
            return;
        }
        Object.defineProperty(currentEntry, 'amount', {
            'get': function () {
                var currentEntry = this;
                if (!isNaN(currentEntry.wholeAmount) && !isNaN(currentEntry.decimalAmount)) {
                    return currentEntry.wholeAmount + currentEntry.decimalAmount;
                } else {
                    return NaN;
                }
            },
            'set': function (value) {
                var currentEntry = this;
                currentEntry.wholeAmount = parseInt(value, 10);
                currentEntry.decimalAmount = value - currentEntry.wholeAmount;
            }
        });
        Object.defineProperty(currentEntry, 'numberOfDecimalDigits', {
            'get': function () {
                var currentEntry = this,
                    decimalDigits = 0;

                if (currentEntry.decimalAmount) {
                    decimalDigits = currentEntry.decimalAmount.toString().length - 2;
                }

                return decimalDigits + currentEntry.numberOfTrailingDecimalZeros;
            }
        });
        Object.defineProperty(currentEntry, 'numberOfDigits', {
            'get': function () {
                var currentEntry = this,
                    wholeDigits,
                    decimalDigits;

                if (currentEntry.amount < 1) {
                    wholeDigits =  0;
                } else {
                    wholeDigits = Math.floor(Math.log10(currentEntry.wholeAmount)) + 1;
                }

                decimalDigits = currentEntry.numberOfDecimalDigits;


                return wholeDigits + decimalDigits;
            }
        });
    }

    function display(valueToDisplay) {
        $('#results').text(valueToDisplay);
    }

    function displayCurrentEntry() {
        if (isNaN(currentEntry.amount)) {
            display(inifinitySymbol);
        } else {
            display(currentEntry.toString());
        }
    }

    function displayOperationStack() {
        var operationStackString = operationStack.reduce(function (a, b) {
            return (operatorSymbols[a] || shortenNumber(a) + (operatorSymbols[b] || shortenNumber(b)));

            function shortenNumber(num) {
                if (isNaN(num) && typeof num !== 'string') {
                    return inifinitySymbol;
                }
                if (isNaN(num)) {
                    return num;
                }
                var workingNum = num;
                if (parseInt(workingNum, 10) !== workingNum) {
                    workingNum = Math.round10(workingNum, -2);
                }
                if (workingNum > 999999) {
                    return workingNum.toExponential(4);
                } else {
                    return workingNum.toString();
                }
            }
        });
        if (operationStackString.length > 35) {
            operationStackString = "..." + operationStackString.substr(-35);
        }
        $('#mathProblem').text(operationStackString);
    }

    function displayOperator(operator) {
        display(operatorSymbols[operator]);
    }

    function handleButtonClick(buttonValueOrOperation) {
        var isOPeration = isNaN(buttonValueOrOperation);
        var isNumericAndAllowed = !isOPeration && !currentEntry.isOperationsOnly && currentEntry.numberOfDigits <= MAX_DIGITS;

        if (isNumericAndAllowed) {
            currentEntry.operationsNotAllowed = false;
            updateCurrentEntry(Number(buttonValueOrOperation));
            displayCurrentEntry();
        }
        if (isOPeration) {
            performOrCacheOperation(buttonValueOrOperation);
        }
    }

    function init() {
        $(function () {
            var isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
            if (!isChrome) {
                var overlay = $('<div id=\'overlay\'>Page works best with Google Chrome or Microsoft Edge browser</div>').prependTo('body').attr('id', 'overlay');
                setTimeout(function () {
                    $('#overlay').fadeOut(500);
                }, 3000);
            }
            setEventHandlers();
            initializeCurrentEntry();
            createCurrentEntrySettersGetters();
            displayCurrentEntry();
        })
    };

    function initializeCurrentEntry() {
        currentEntry.wholeAmount = 0;
        currentEntry.decimalAmount = 0;
        currentEntry.powerOfTen = null;
        currentEntry.decimalMode = false;
        currentEntry.isOperationsOnly = false;
        currentEntry.operationsNotAllowed = false;
        currentEntry.numberOfTrailingDecimalZeros = 0;
    }

    function mathOperation(operation, x, y) {
        switch (operation) {
            case "add":
                return x + y;
                break;
            case "subtract":
                return x - y;
                break;
            case "multiply":
                return x * y;
                break;
            case "divide":
                return x / y;
                break;
        };
    }

    function performOrCacheOperation(operation) {
        switch (operation) {
            case "dot":
                currentEntry.decimalMode = true;
                if (currentEntry.powerOfTen === null) {
                    currentEntry.powerOfTen = -1;
                }
                break;
            case "allclear":
                initializeCurrentEntry();
                displayCurrentEntry();
                operationStack = [];
                $('#mathProblem').text('');
                break;
            case "clearentry":
                if (!currentEntry.isOperationsOnly) {
                    initializeCurrentEntry();
                    displayCurrentEntry();
                }
                break;
            case "add":
            case "subtract":
            case "multiply":
            case "divide":
                if (!currentEntry.operationsNotAllowed) {
                    operationStack.push(currentEntry.amount);
                    operationStack.push(operation);
                    initializeCurrentEntry();
                    displayOperator(operation);
                    displayOperationStack();
                    currentEntry.operationsNotAllowed = true;
                }
                break;
            case "equals":
                if (!currentEntry.isOperationsOnly && !currentEntry.operationsNotAllowed) {
                    operationStack.push(currentEntry.amount);
                    setCurrentEntry(calculateStack());
                    operationStack.push('equals');
                    operationStack.push(currentEntry.amount);
                    displayOperationStack();
                    operationStack = [];
                    displayCurrentEntry();
                    currentEntry.isOperationsOnly = true;
                }
                break;
        };
    }

    function setCurrentEntry(amount) {
        currentEntry.amount = amount;
        currentEntry.powerOfTen = null;
        currentEntry.decimalMode = false;
    }

    function setEventHandlers() {
        $('a').click(function (event) {
            handleButtonClick(event.target.id);
        });
    }

    function updateCurrentEntry(digit) {
        if (currentEntry.decimalMode) {
            currentEntry.decimalAmount += digit * Math.pow(10, currentEntry.powerOfTen);
            currentEntry.decimalAmount = Math.round10(currentEntry.decimalAmount, currentEntry.powerOfTen);
            currentEntry.powerOfTen--;
            if (0 === digit) {
                currentEntry.numberOfTrailingDecimalZeros++;
            } else {
                currentEntry.numberOfTrailingDecimalZeros = 0;
            }
        } else {
            currentEntry.wholeAmount = (currentEntry.wholeAmount * 10) + digit;
        }
    }

    return {
        init: init
    };
}());

calc.init();
