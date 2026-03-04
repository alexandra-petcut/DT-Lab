function test() {
    console.log("2 + 3 = 5", calculate(2, 3, "+") === 5 ? "Passed" : "Failed");
    console.log("5 - 2 = 3", calculate(5, 2, "-") === 3 ? "Passed" : "Failed");
    console.log("4 * 3 = 12", calculate(4, 3, "*") === 12 ? "Passed" : "Failed");
    console.log("10 / 2 = 5", calculate(10, 2, "/") === 5 ? "Passed" : "Failed");
    console.log("10 % 3 = 1", calculate(10, 3, "%") === 1 ? "Passed" : "Failed");
    console.log("division by zero", calculate(5, 0, "/") === "Division by zero" ? "Passed" : "Failed");
    console.log("modulus by zero", calculate(5, 0, "%") === "Division by zero" ? "Passed" : "Failed");
    console.log("NaN input", calculate(NaN, 3, "+") === "Not a number" ? "Passed" : "Failed");
}

test();