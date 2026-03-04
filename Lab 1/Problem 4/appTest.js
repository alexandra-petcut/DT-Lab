function test () {
    console.log(JSON.stringify(getFibonacci(2)) === JSON.stringify([1,1])?"Passed":"Failed");
    console.log(JSON.stringify(getFibonacci(5)) == JSON.stringify([1,1,2,3,5])?"Passed":"Failed");
    console.log(getFibonacci("abc") === "Not allowed"?"Passed":"Failed");
    console.log(getFibonacci() === "Not allowed"?"Passed":"Failed");
    console.log(getFibonacci(0) === "Not allowed"?"Passed":"Failed");
    console.log(getFibonacci(11) === "Not allowed"?"Passed":"Failed");
}

test();