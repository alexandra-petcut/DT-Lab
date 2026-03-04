var counter1 = 0;
var counter2 = 10;

function printValue (divId, value) {
    document.getElementById(divId).innerHTML = value;
}
printValue("counter1", 0);
printValue("counter2", 10);

document.getElementById("inc").addEventListener ("click",increment);
document.getElementById("dec").addEventListener ("click",decrement);

function increment() {
    counter1++;
    printValue("counter1", counter1) ;

}

function decrement() {
    counter2--;
    printValue("counter2", counter2);

    if(counter2 == 0)
        counter2 = 11;
}