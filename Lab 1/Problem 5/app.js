function calculate(a, b, operator) {
    if (!Number.isInteger(a) || !Number.isInteger(b)) return "Not a number";

    switch (operator) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
            if (b === 0) return "Division by zero";
            return a / b;
        case "%":
            if (b === 0) return "Division by zero";
            return a % b;
        default: return "Invalid operator";
    }
}

$("#equals").on('click', function () {
    var firstNumberText = $('#firstNumber').val();
    var secondNumberText = $('#secondNumber').val();
    var operator = $('#operator').val();

    if (firstNumberText === "" || secondNumberText === "") {
        $("#result").val(""); 
        return;
    }

    var firstNumber = parseInt(firstNumberText);
    var secondNumber = parseInt(secondNumberText);

    var result = calculate(firstNumber, secondNumber, operator);
    $("#result").val(result);
});