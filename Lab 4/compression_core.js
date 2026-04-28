/*
  Chapter 4 - Data compression solution
  Huffman + Shannon-Fano algorithms.

  Convention from the laboratory text:
    left branch  = 0
    right branch = 1
*/

const LEFT_BIT = "0";
const RIGHT_BIT = "1";

function frequencyMap(text) {
  const map = new Map();
  for (const ch of text) {
    map.set(ch, (map.get(ch) || 0) + 1);
  }
  return map;
}

function symbolName(ch) {
  if (ch === " ") return "space";
  if (ch === "\n") return "\\n";
  if (ch === "\t") return "\\t";
  if (ch === "\r") return "\\r";
  return ch;
}

function makeLeaf(ch, count, order) {
  return {
    ch,
    count,
    left: null,
    right: null,
    order,
    symbols: ch,
  };
}

function isLeaf(node) {
  return !node.left && !node.right && node.ch !== null;
}

function nodeSortKey(node) {
  // Used only for deterministic tie-breaking.
  return node.symbols || node.ch || "";
}

function buildHuffmanTree(freq) {
  let nextOrder = 0;
  const nodes = Array.from(freq.entries()).map(([ch, count]) => makeLeaf(ch, count, nextOrder++));

  if (nodes.length === 0) return null;

  if (nodes.length === 1) {
    return {
      ch: null,
      count: nodes[0].count,
      left: nodes[0],
      right: null,
      order: nextOrder++,
      symbols: nodes[0].symbols,
    };
  }

  while (nodes.length > 1) {
    // Greedy Huffman step: merge the two least frequent nodes.
    // Extra comparisons make the result repeatable when frequencies are equal.
    nodes.sort((a, b) => {
      if (a.count !== b.count) return a.count - b.count;
      if (a.order !== b.order) return a.order - b.order;
      return nodeSortKey(a).localeCompare(nodeSortKey(b));
    });

    const left = nodes.shift();
    const right = nodes.shift();

    nodes.push({
      ch: null,
      count: left.count + right.count,
      left,
      right,
      order: nextOrder++,
      symbols: `${left.symbols}${right.symbols}`,
    });
  }

  return nodes[0];
}

function splitShannonFanoItems(items) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  let bestSplit = 1;
  let bestDifference = Infinity;
  let leftTotal = 0;

  // Split into two non-empty groups whose totals are as close as possible.
  for (let i = 1; i < items.length; i++) {
    leftTotal += items[i - 1].count;
    const rightTotal = total - leftTotal;
    const difference = Math.abs(leftTotal - rightTotal);

    if (difference < bestDifference) {
      bestDifference = difference;
      bestSplit = i;
    }
  }

  return bestSplit;
}

function buildShannonFanoTree(freq) {
  let nextOrder = 0;
  const items = Array.from(freq.entries())
    .map(([ch, count]) => makeLeaf(ch, count, nextOrder++))
    .sort((a, b) => {
      // Shannon-Fano starts from symbols sorted by descending frequency.
      if (a.count !== b.count) return b.count - a.count;
      return a.order - b.order;
    });

  if (items.length === 0) return null;

  function buildGroup(group) {
    if (group.length === 1) return group[0];

    const split = splitShannonFanoItems(group);
    const leftGroup = group.slice(0, split);
    const rightGroup = group.slice(split);
    const left = buildGroup(leftGroup);
    const right = buildGroup(rightGroup);

    return {
      ch: null,
      count: group.reduce((sum, item) => sum + item.count, 0),
      left,
      right,
      order: nextOrder++,
      symbols: group.map((item) => item.symbols).join(""),
    };
  }

  return buildGroup(items);
}

function buildCodes(node, prefix = "", out = {}) {
  if (!node) return out;

  if (isLeaf(node)) {
    out[node.ch] = prefix || LEFT_BIT;
    return out;
  }

  if (node.left) buildCodes(node.left, prefix + LEFT_BIT, out);
  if (node.right) buildCodes(node.right, prefix + RIGHT_BIT, out);
  return out;
}

function encode(text, codeTable) {
  return text
    .split("")
    .map((ch) => {
      if (!(ch in codeTable)) throw new Error(`Missing code for symbol ${JSON.stringify(ch)}`);
      return codeTable[ch];
    })
    .join("");
}

function decode(bits, tree) {
  if (!tree) return "";

  // Special case: input contains only one distinct symbol.
  if (tree.left && !tree.right && isLeaf(tree.left)) {
    return tree.left.ch.repeat(bits.length);
  }

  let out = "";
  let node = tree;

  for (const bit of bits) {
    node = bit === LEFT_BIT ? node.left : node.right;
    if (!node) throw new Error(`Invalid bit sequence near bit ${bit}`);

    if (isLeaf(node)) {
      out += node.ch;
      node = tree;
    }
  }

  return out;
}

function compressionStats(text, encodedBits) {
  const originalBits = text.length * 8;
  const compressedBits = encodedBits.length;
  return {
    originalBits,
    compressedBits,
    compressionRatio: compressedBits === 0 ? 0 : originalBits / compressedBits,
    // Laboratory formula: gamma = [1 - c / o] * 100%.
    compressionRate: originalBits === 0 ? 0 : (1 - compressedBits / originalBits) * 100,
  };
}

function sortedCodeRows(freq, codes) {
  return Array.from(freq.entries())
    .map(([ch, count]) => ({
      symbol: symbolName(ch),
      rawSymbol: ch,
      frequency: count,
      code: codes[ch],
      bits: codes[ch].length,
    }))
    .sort((a, b) => {
      if (b.frequency !== a.frequency) return b.frequency - a.frequency;
      return a.symbol.localeCompare(b.symbol);
    });
}

function nodeLabel(node, code, level) {
  if (isLeaf(node)) {
    return `Level ${level}: ${symbolName(node.ch)} (${node.count}) | code=${code || LEFT_BIT}`;
  }
  return level === 0
    ? `A0 = ${node.count}`
    : `Level ${level}: ${node.count} | prefix=${code}`;
}

function toD3TreeData(node, code = "", level = 0, bitFromParent = "") {
  if (!node) return null;

  const children = [];
  if (node.left) children.push(toD3TreeData(node.left, code + LEFT_BIT, level + 1, LEFT_BIT));
  if (node.right) children.push(toD3TreeData(node.right, code + RIGHT_BIT, level + 1, RIGHT_BIT));

  const d3Node = {
    name: nodeLabel(node, code, level),
    count: node.count,
    code,
    bit: bitFromParent,
    symbol: isLeaf(node) ? symbolName(node.ch) : null,
  };

  if (children.length > 0) d3Node.children = children;
  return d3Node;
}

function printTree(node, prefix = "", edge = "root", code = "") {
  if (!node) return "(empty tree)";

  const currentLabel = isLeaf(node)
    ? `${edge}: ${symbolName(node.ch)} freq=${node.count} code=${code || LEFT_BIT}`
    : `${edge}: freq=${node.count}${code ? ` prefix=${code}` : ""}`;

  const lines = [`${prefix}${currentLabel}`];
  const childPrefix = `${prefix}  `;

  if (node.left) lines.push(printTree(node.left, childPrefix, LEFT_BIT, code + LEFT_BIT));
  if (node.right) lines.push(printTree(node.right, childPrefix, RIGHT_BIT, code + RIGHT_BIT));

  return lines.join("\n");
}

function analyze(text, algorithmName, treeBuilder) {
  const freq = frequencyMap(text);
  const tree = treeBuilder(freq);
  const codes = buildCodes(tree);
  const encodedBits = encode(text, codes);
  const decodedText = decode(encodedBits, tree);
  const stats = compressionStats(text, encodedBits);

  return {
    algorithmName,
    text,
    frequency: freq,
    tree,
    d3TreeData: toD3TreeData(tree),
    codes,
    codeRows: sortedCodeRows(freq, codes),
    encodedBits,
    decodedText,
    roundTripEqual: decodedText === text,
    stats,
    asciiTree: printTree(tree),
  };
}

function analyzeBoth(text) {
  return {
    huffman: analyze(text, "Huffman", buildHuffmanTree),
    shannonFano: analyze(text, "Shannon-Fano", buildShannonFanoTree),
  };
}

const CompressionCore = {
  frequencyMap,
  buildHuffmanTree,
  buildShannonFanoTree,
  buildCodes,
  encode,
  decode,
  compressionStats,
  sortedCodeRows,
  toD3TreeData,
  printTree,
  analyze,
  analyzeBoth,
  symbolName,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CompressionCore;
}
