var FOUR_B_FIVE_B = {
  "0000": "11110",
  "0001": "01001",
  "0010": "10100",
  "0011": "10101",
  "0100": "01010",
  "0101": "01011",
  "0110": "01110",
  "0111": "01111",
  "1000": "10010",
  "1001": "10011",
  "1010": "10110",
  "1011": "10111",
  "1100": "11010",
  "1101": "11011",
  "1110": "11100",
  "1111": "11101"
};

function duplicateBitLevels(levels) {
  var result = [];
  levels.forEach(function (level) {
    result.push(level, level);
  });
  return result;
}

function getNrzLevelEncoding(bits) {
  return duplicateBitLevels(bits.map(function (bit) {
    return bit === 1 ? 1 : -1;
  }));
}

function getNrzMarkEncoding(bits) {
  var level = -1;
  return duplicateBitLevels(bits.map(function (bit) {
    if (bit === 1) level *= -1;
    return level;
  }));
}

function getNrzSpaceEncoding(bits) {
  var level = -1;
  return duplicateBitLevels(bits.map(function (bit) {
    if (bit === 0) level *= -1;
    return level;
  }));
}

function getRzUnipolarEncoding(bits) {
  return bits.flatMap(function (bit) {
    return bit === 1 ? [1, 0] : [0, 0];
  });
}

function getRzBipolarEncoding(bits) {
  return bits.flatMap(function (bit) {
    return bit === 1 ? [1, 0] : [-1, 0];
  });
}

function getManchesterLevelEncoding(bits) {
  return bits.flatMap(function (bit) {
    return bit === 1 ? [-1, 1] : [1, -1];
  });
}

function getBiphaseMarkEncoding(bits) {
  var level = -1;
  var result = [];
  bits.forEach(function (bit) {
    level *= -1;
    result.push(level);
    if (bit === 1) level *= -1;
    result.push(level);
  });
  return result;
}

function getBiphaseSpaceEncoding(bits) {
  var level = -1;
  var result = [];
  bits.forEach(function (bit) {
    level *= -1;
    result.push(level);
    if (bit === 0) level *= -1;
    result.push(level);
  });
  return result;
}

function getNrziEncoding(bits) {
  return getNrzMarkEncoding(bits);
}

function getDifferentialManchesterEncoding(bits) {
  var level = -1;
  var result = [];
  bits.forEach(function (bit) {
    if (bit === 0) level *= -1;
    result.push(level);
    level *= -1;
    result.push(level);
  });
  return result;
}

function getAmiEncoding(bits) {
  var polarity = 1;
  var levels = bits.map(function (bit) {
    if (bit === 0) return 0;
    var level = polarity;
    polarity *= -1;
    return level;
  });
  return duplicateBitLevels(levels);
}

function getMlt3Encoding(bits) {
  var states = [0, 1, 0, -1];
  var index = 0;
  var levels = bits.map(function (bit) {
    if (bit === 1) index = (index + 1) % states.length;
    return states[index];
  });
  return duplicateBitLevels(levels);
}

function getHdb3Encoding(bits) {
  var result = [];
  var lastPulse = -1;
  var pulsesSinceSubstitution = 0;
  var zeroCount = 0;

  bits.forEach(function (bit) {
    if (bit === 1) {
      lastPulse *= -1;
      result.push(lastPulse);
      pulsesSinceSubstitution += 1;
      zeroCount = 0;
      return;
    }

    result.push(0);
    zeroCount += 1;

    if (zeroCount === 4) {
      var start = result.length - 4;
      if (pulsesSinceSubstitution % 2 === 0) {
        var balancingPulse = -lastPulse;
        result[start] = balancingPulse;
        result[start + 3] = balancingPulse;
        lastPulse = balancingPulse;
      } else {
        result[start + 3] = lastPulse;
      }
      pulsesSinceSubstitution = 0;
      zeroCount = 0;
    }
  });

  return duplicateBitLevels(result);
}

function getB8zsEncoding(bits) {
  var result = [];
  var polarity = 1;
  var lastPulse = -1;

  for (var i = 0; i < bits.length; i++) {
    var nextEight = bits.slice(i, i + 8).join("");
    if (nextEight === "00000000") {
      var substitution = lastPulse > 0 ? [0, 0, 0, 1, -1, 0, -1, 1] : [0, 0, 0, -1, 1, 0, 1, -1];
      result.push.apply(result, substitution);
      lastPulse = substitution[substitution.length - 1];
      polarity = -lastPulse;
      i += 7;
      continue;
    }

    if (bits[i] === 0) {
      result.push(0);
    } else {
      var level = polarity;
      result.push(level);
      lastPulse = level;
      polarity *= -1;
    }
  }

  return duplicateBitLevels(result);
}

function getFourBFiveBNrziEncoding(bits) {
  var padded = bits.slice();
  while (padded.length % 4 !== 0) padded.push(0);

  var encoded = "";
  for (var i = 0; i < padded.length; i += 4) {
    encoded += FOUR_B_FIVE_B[padded.slice(i, i + 4).join("")];
  }

  return {
    bits: encoded,
    levels: getNrziEncoding(parseBitStream(encoded)),
    padded: padded.length !== bits.length
  };
}

function getEncodings(bits) {
  var fourFive = getFourBFiveBNrziEncoding(bits);
  return [
    {
      name: "NRZ-L",
      description: "Level code",
      rule: "1 = +V, 0 = -V",
      levels: getNrzLevelEncoding(bits),
      output: levelsToText(getNrzLevelEncoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "NRZ-M",
      description: "Mark code",
      rule: "1 = transition at bit start, 0 = no transition",
      levels: getNrzMarkEncoding(bits),
      output: levelsToText(getNrzMarkEncoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "NRZ-S",
      description: "Space code",
      rule: "0 = transition at bit start, 1 = no transition",
      levels: getNrzSpaceEncoding(bits),
      output: levelsToText(getNrzSpaceEncoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "RZ unipolar",
      description: "Return to zero",
      rule: "1 = +V then 0V, 0 = 0V",
      levels: getRzUnipolarEncoding(bits),
      output: pairsToText(getRzUnipolarEncoding(bits))
    },
    {
      name: "RZ bipolar",
      description: "Return to zero",
      rule: "1 = +V then 0V, 0 = -V then 0V",
      levels: getRzBipolarEncoding(bits),
      output: pairsToText(getRzBipolarEncoding(bits))
    },
    {
      name: "Biphase-L",
      description: "Manchester",
      rule: "1 = -V to +V at T/2, 0 = +V to -V at T/2",
      levels: getManchesterLevelEncoding(bits),
      output: pairsToText(getManchesterLevelEncoding(bits))
    },
    {
      name: "Biphase-M",
      description: "Biphase mark",
      rule: "Transition at bit start; 1 also transitions at T/2",
      levels: getBiphaseMarkEncoding(bits),
      output: pairsToText(getBiphaseMarkEncoding(bits))
    },
    {
      name: "Biphase-S",
      description: "Biphase space",
      rule: "Transition at bit start; 0 also transitions at T/2",
      levels: getBiphaseSpaceEncoding(bits),
      output: pairsToText(getBiphaseSpaceEncoding(bits))
    },
    {
      name: "NRZ-INV",
      description: "NRZI",
      rule: "1 = inversion at bit start, 0 = hold level",
      levels: getNrziEncoding(bits),
      output: levelsToText(getNrziEncoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "Biphase-DIF",
      description: "Differential Manchester",
      rule: "Middle transition always; 0 also transitions at bit start",
      levels: getDifferentialManchesterEncoding(bits),
      output: pairsToText(getDifferentialManchesterEncoding(bits))
    },
    {
      name: "AMI",
      description: "Alternate mark inversion",
      rule: "0 = 0V; consecutive 1s alternate +V, -V",
      levels: getAmiEncoding(bits),
      output: levelsToText(getAmiEncoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "HDB-3",
      description: "High density bipolar",
      rule: "AMI with 0000 substitution to keep synchronization",
      levels: getHdb3Encoding(bits),
      output: levelsToText(getHdb3Encoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "B8ZS",
      description: "Bipolar with 8 zeros substitution",
      rule: "AMI with 00000000 substituted by violation patterns",
      levels: getB8zsEncoding(bits),
      output: levelsToText(getB8zsEncoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "4B/5B NRZI",
      description: fourFive.padded ? "Input padded to a multiple of 4 bits" : "4-bit groups mapped to 5-bit words",
      rule: "4B/5B table, then NRZI: 1 = transition, 0 = hold",
      levels: fourFive.levels,
      output: fourFive.bits + " -> " + levelsToText(fourFive.levels.filter(function (_, index) { return index % 2 === 0; }))
    },
    {
      name: "MLT-3",
      description: "Multilevel transmission",
      rule: "1 moves through 0, +V, 0, -V; 0 holds previous level",
      levels: getMlt3Encoding(bits),
      output: levelsToText(getMlt3Encoding(bits).filter(function (_, index) { return index % 2 === 0; }))
    }
  ];
}
