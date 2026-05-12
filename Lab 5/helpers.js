function validateBit(character) {
  return character === "0" || character === "1";
}

function validateBitStream(stream) {
  return typeof stream === "string" && stream.length > 0 && /^[01]+$/.test(stream);
}

function getBitstream(n) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push({ value: null });
  }
  return result;
}

function parseBitStream(stream) {
  return stream.split("").map(function (bit) {
    return parseInt(bit, 10);
  });
}

function levelName(level) {
  if (level > 0) return "+V";
  if (level < 0) return "-V";
  return "0V";
}

function levelsToText(levels) {
  return levels.map(levelName).join(" ");
}

function pairsToText(levels) {
  var pairs = [];
  for (var i = 0; i < levels.length; i += 2) {
    pairs.push(levelName(levels[i]) + "/" + levelName(levels[i + 1]));
  }
  return pairs.join(" | ");
}
