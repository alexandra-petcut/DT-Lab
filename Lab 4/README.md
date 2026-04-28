# Chapter 4 - Data compression solution

This project solves the Chapter 4 suggested problems:

1. Implement the Huffman compression algorithm and display the compression tree.
2. Implement the Shannon-Fano compression algorithm and display the compression tree.

The solution uses the lab convention:

- left branch = `0`
- right branch = `1`

The default input is:

```js
const input = "this is a simple huffman example for transmission compression";
```

## Browser / D3 display

Open `index.html` through a local server.

Using the lab's suggested server:

```bash
npm install -g http-server
cd chapter4-compression-solution
http-server
```

Then open the address printed by `http-server` in your browser.

The page displays:

- code table for Huffman
- Huffman compression tree
- code table for Shannon-Fano
- Shannon-Fano compression tree
- generated `treeData` objects that can be pasted into the lab's `arbore.js`

## Node console version

Run:

```bash
node compression_node.js
```

This prints:

- code tables
- ASCII compression trees
- generated D3 `treeData` objects
- original bits
- compressed bits
- compression ratio `original/compressed`
- compression rate using the lab formula: `gamma = [1 - compressed/original] * 100%`
- round-trip decoding check
