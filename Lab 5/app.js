var input = document.getElementById("bit-stream");
var grid = document.getElementById("encoder-grid");
var bitsModel = document.getElementById("bits-model");
var statusText = document.getElementById("status-text");

function yForLevel(level) {
  if (level > 0) return 25;
  if (level < 0) return 85;
  return 55;
}

function buildWavePoints(levels, stepWidth) {
  if (levels.length === 0) return "";
  var points = ["0," + yForLevel(levels[0])];
  for (var i = 0; i < levels.length; i++) {
    var x = (i + 1) * stepWidth;
    points.push(x + "," + yForLevel(levels[i]));
    if (i < levels.length - 1 && levels[i] !== levels[i + 1]) {
      points.push(x + "," + yForLevel(levels[i + 1]));
    }
  }
  return points.join(" ");
}

function renderWaveform(encoding, bits) {
  var stepWidth = 26;
  var width = Math.max(encoding.levels.length * stepWidth, 680);
  var bitCount = encoding.name === "4B/5B NRZI"
    ? Math.ceil(encoding.levels.length / 2)
    : bits.length;
  var boundaries = "";
  for (var i = 0; i <= bitCount; i++) {
    var x = i * stepWidth * 2;
    boundaries += '<line class="bit-boundary" x1="' + x + '" y1="16" x2="' + x + '" y2="96"></line>';
  }

  var labels = bits.map(function (bit, index) {
    var x = index * stepWidth * 2 + stepWidth;
    return '<text class="bit-label" x="' + x + '" y="13" text-anchor="middle">' + bit + "</text>";
  }).join("");

  return [
    '<svg class="wave" viewBox="0 0 ' + width + ' 108" width="' + width + '" height="108" role="img">',
    '<line class="axis" x1="0" y1="25" x2="' + width + '" y2="25"></line>',
    '<line class="axis" x1="0" y1="55" x2="' + width + '" y2="55"></line>',
    '<line class="axis" x1="0" y1="85" x2="' + width + '" y2="85"></line>',
    '<text class="level-label" x="4" y="22">+V</text>',
    '<text class="level-label" x="4" y="52">0</text>',
    '<text class="level-label" x="4" y="82">-V</text>',
    boundaries,
    labels,
    '<polyline class="wave-line" points="' + buildWavePoints(encoding.levels, stepWidth) + '"></polyline>',
    "</svg>"
  ].join("");
}

function render() {
  var stream = input.value.replace(/\s+/g, "");
  var valid = validateBitStream(stream);
  input.classList.toggle("invalid", !valid);

  if (!valid) {
    grid.innerHTML = "";
    bitsModel.textContent = "Use only 0 and 1.";
    statusText.textContent = "The encoder updates after a valid bit stream is entered.";
    return;
  }

  var bits = parseBitStream(stream);
  var encodings = getEncodings(bits);
  bitsModel.textContent = JSON.stringify(bits.map(function (bit) {
    return { value: bit };
  }));
  statusText.textContent = "Initial dynamic encoders start from -V; AMI starts with +V for the first 1.";

  grid.innerHTML = encodings.map(function (encoding) {
    return [
      '<article class="encoder-row">',
      '<div class="code-name"><strong>' + encoding.name + '</strong><span>' + encoding.description + '</span></div>',
      '<div class="wave-wrap">' + renderWaveform(encoding, bits) + '</div>',
      '<div class="rule"><strong>Rule</strong><span>' + encoding.rule + '</span><code>' + encoding.output + '</code></div>',
      "</article>"
    ].join("");
  }).join("");
}

input.addEventListener("input", render);

document.querySelectorAll("[data-example]").forEach(function (button) {
  button.addEventListener("click", function () {
    input.value = button.getAttribute("data-example");
    render();
  });
});

render();
