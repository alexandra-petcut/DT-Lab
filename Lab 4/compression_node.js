const {
  analyzeBoth,
} = require("./compression_core");

const input = "this is a simple huffman example for transmission compression";

function printAnalysis(result) {
  console.log(`\n================ ${result.algorithmName} ================`);
  console.log("Input:", result.text);
  console.log("\nCode table:");
  for (const row of result.codeRows) {
    console.log(`${JSON.stringify(row.symbol).padEnd(10)} freq=${String(row.frequency).padStart(2)} code=${row.code}`);
  }

  console.log("\nCompression tree:");
  console.log(result.asciiTree);

  console.log("\nD3 treeData object, ready to paste into arbore.js:");
  console.log(`var treeData = ${JSON.stringify(result.d3TreeData, null, 2)};`);

  console.log("\nOriginal bits:", result.stats.originalBits);
  console.log("Encoded bits:", result.stats.compressedBits);
  console.log("Compression ratio o/c:", result.stats.compressionRatio.toFixed(3));
  console.log("Compression rate gamma:", `${result.stats.compressionRate.toFixed(2)}%`);
  console.log("Round-trip equal:", result.roundTripEqual);
  console.log("Encoded bits:", result.encodedBits);
}

const results = analyzeBoth(input);
printAnalysis(results.huffman);
printAnalysis(results.shannonFano);
