document.getElementById("n").addEventListener('input', inputFib);

function inputFib() {
    var inputNumber = parseInt(document.getElementById("n").value);
    console.log(getFibonacci(inputNumber));
}

function getFibonacci(n) {

    if(!Number.isInteger(n)) return "Not allowed";
    if(n < 1 || n > 10) return "Not allowed";

    if (n === 1) return [1];
    if (n === 2) return [1,1];

    let fib = [1,1];

    for(var i = 2; i < n; i++) {
        fib.push(fib[i-1]+fib[i-2]);
    }

    return fib;
}