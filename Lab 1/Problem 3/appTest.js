function test () {
    console.log(sum("abc") == "Not a number"?"Passed":"Failed");
    console.log(sum(true) == "Not a number"?"Passed":"Failed");
}

test();