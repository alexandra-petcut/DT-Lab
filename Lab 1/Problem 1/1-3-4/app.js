var counter = 0;

function printValue (divId, value) {
    $("#"+divId).html(value)
}
printValue("counter", 0);

$("#inc").on('click', increment);

function increment() {
    counter++;
    printValue("counter", counter);

}
 
// Reading & Setting value

/* 
var textValue = $('#counter').text(); 
console.log(textValue);
$('#counter').text('123');
*/