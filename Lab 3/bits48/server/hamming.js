function decode(bits) {
  // General Hamming decoder for any codeword length n.
  // Parity bits sit at positions that are powers of two (1, 2, 4, 8, ...).
  // The "syndrome" is the binary number formed by the failing parity checks;
  // it equals the 1-indexed position of the flipped bit (or 0 if no error).
  const n = bits.length;

  // 1. Number of parity bits = number of powers of 2 that are <= n
  let r = 0;
  while ((1 << r) <= n) r++;

  // 2. Recompute each parity. If parity p fails, add 2^p to the syndrome.
  let errorPosition = 0;
  for (let p = 0; p < r; p++) {
    const parityPos = 1 << p;
    let sum = 0;
    for (let j = 1; j <= n; j++) {
      if ((j & parityPos) !== 0) {
        sum += bits[j - 1];
      }
    }
    if (sum % 2 !== 0) {
      errorPosition += parityPos;
    }
  }

  const errorDetected = errorPosition !== 0;
  if (errorDetected) {
    bits[errorPosition - 1] = (bits[errorPosition - 1] + 1) % 2;
  }

  return {
    errorCorrected: errorDetected,
    errorPosition: errorPosition - 1,
    bits: bits
  };
}

exports.decode = decode;
