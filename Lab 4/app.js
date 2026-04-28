function renderStats(result) {
  const s = result.stats;
  return `
    <div class="stats-grid">
      <div class="stat"><strong>Original bits</strong><span>${s.originalBits}</span></div>
      <div class="stat"><strong>Encoded bits</strong><span>${s.compressedBits}</span></div>
      <div class="stat"><strong>Compression ratio o/c</strong><span>${s.compressionRatio.toFixed(3)}</span></div>
      <div class="stat"><strong>Compression rate gamma</strong><span>${s.compressionRate.toFixed(2)}%</span></div>
      <div class="stat"><strong>Round trip</strong><span>${result.roundTripEqual ? "OK" : "Failed"}</span></div>
    </div>
  `;
}

function renderCodeTable(result) {
  const rows = result.codeRows.map((row) => `
    <tr>
      <td><code>${escapeHtml(row.symbol)}</code></td>
      <td>${row.frequency}</td>
      <td><code>${row.code}</code></td>
      <td>${row.bits}</td>
    </tr>
  `).join("");

  return `
    ${renderStats(result)}
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Frequency</th>
          <th>New code</th>
          <th>Code length</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <details>
      <summary>Encoded bit sequence</summary>
      <pre>${result.encodedBits}</pre>
    </details>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTree(selector, d3TreeData) {
  const container = d3.select(selector);
  container.selectAll("*").remove();

  if (!d3TreeData) {
    container.append("p").text("Empty tree");
    return;
  }

  const root = d3.hierarchy(d3TreeData);
  const dx = 28;
  const dy = 230;

  const tree = d3.tree().nodeSize([dx, dy]);
  tree(root);

  let x0 = Infinity;
  let x1 = -x0;
  root.each((d) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const width = Math.max(1100, root.height * dy + 360);
  const height = Math.max(520, x1 - x0 + dx * 4);

  const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-80, x0 - dx * 2, width, height]);

  const g = svg.append("g");

  g.append("g")
    .selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x));

  g.append("g")
    .selectAll("text")
    .data(root.links())
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("x", (d) => (d.source.y + d.target.y) / 2)
    .attr("y", (d) => (d.source.x + d.target.x) / 2 - 4)
    .attr("text-anchor", "middle")
    .text((d) => d.target.data.bit);

  const node = g.append("g")
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node.append("circle")
    .attr("r", 8);

  node.append("text")
    .attr("dy", "0.32em")
    .attr("x", (d) => d.children ? -12 : 12)
    .attr("text-anchor", (d) => d.children ? "end" : "start")
    .text((d) => d.data.name);
}

function run() {
  const input = document.getElementById("inputText").value;
  const results = CompressionCore.analyzeBoth(input);

  document.getElementById("summary").innerHTML = `
    <h2>Input summary</h2>
    <p><strong>Characters:</strong> ${input.length}</p>
    <p><strong>Distinct symbols:</strong> ${results.huffman.frequency.size}</p>
    <p><strong>Laboratory compression-rate formula:</strong> gamma = [1 - compressed/original] * 100%</p>
  `;

  document.getElementById("huffmanOutput").innerHTML = renderCodeTable(results.huffman);
  document.getElementById("shannonOutput").innerHTML = renderCodeTable(results.shannonFano);

  document.getElementById("huffmanTreeData").textContent = `var treeData = ${JSON.stringify(results.huffman.d3TreeData, null, 2)};`;
  document.getElementById("shannonTreeData").textContent = `var treeData = ${JSON.stringify(results.shannonFano.d3TreeData, null, 2)};`;

  renderTree("#huffmanTree", results.huffman.d3TreeData);
  renderTree("#shannonTree", results.shannonFano.d3TreeData);
}

document.getElementById("runButton").addEventListener("click", run);
run();
