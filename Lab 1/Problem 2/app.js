var counter= 0;

function printValue (divId, value) {
    document.getElementById(divId).innerHTML = value;
}
printValue("counter", 0);

document.getElementById("inc").addEventListener ("click",increment);
document.getElementById("dec").addEventListener ("click",decrement);

function increment() {
    counter++;
    if(counter == 11)
        counter = 0;

    printValue("counter", counter);
}

function decrement() {
    counter--;
    if(counter == -1)
    counter = 10;
    
    printValue("counter", counter);
}