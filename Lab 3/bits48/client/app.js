let app = new Vue({
  el: '#hamming-encoder',
  data: {
    dataBits: [],
    status: '',
    encodedMessage: [],
    numberOfDataBits: 4
  },
  created: function () {
    this.initDataBits();
  },
  methods: {
    initDataBits: function () {
      this.dataBits = [];
      this.encodedMessage = [];
      this.status = '';

      for (let i = 0; i < this.numberOfDataBits; i++) {
        let bit = { data: null };
        this.dataBits.push(bit);
      }
    },
    send: function () {
      if (this.validate(this.dataBits) === true) {
        this.encodedMessage = this.encode(this.dataBits);

        return axios
          .put('http://localhost:3000/message', { bits: this.encodedMessage })
          .then(response => (this.status = response.data));
      } else {
        this.status =
          'Input is not valid. Please use 0 or 1 as data bit values';
      }
    },
    encode: function (bits) {
      // General Hamming(n, k) encoder for any number of data bits.
      // Parity bits sit at positions that are powers of two (1, 2, 4, 8, ...).
      // Data bits fill all the remaining positions, in order.
      const k = bits.length;

      // 1. Find the smallest r such that 2^r >= k + r + 1
      let r = 0;
      while ((1 << r) < k + r + 1) r++;
      const n = k + r;

      // 2. Build the codeword as a 1-indexed array. Place data bits in
      //    non-power-of-2 positions, leave parity slots as 0 for now.
      const codeword = new Array(n + 1).fill(0);
      let dataIndex = 0;
      for (let i = 1; i <= n; i++) {
        // i is a power of two iff (i & (i - 1)) === 0
        if ((i & (i - 1)) !== 0) {
          codeword[i] = parseInt(bits[dataIndex].data);
          dataIndex++;
        }
      }

      // 3. Compute each parity bit at position 2^p so the XOR of all bits
      //    in positions whose binary representation has bit p set is 0.
      for (let p = 0; p < r; p++) {
        const parityPos = 1 << p;
        let sum = 0;
        for (let j = 1; j <= n; j++) {
          if (j !== parityPos && (j & parityPos) !== 0) {
            sum += codeword[j];
          }
        }
        codeword[parityPos] = sum % 2;
      }

      // Return as 0-indexed array (drop the dummy index 0)
      return codeword.slice(1);
    },
    parity: function (number) {
      return number % 2;
    },
    validate: function (bits) {
      for (var i = 0; i < bits.length; i++) {
        if (this.validateBit(bits[i].data) === false) return false;
      }
      return true;
    },
    validateBit: function (character) {
      if (character === null) return false;
      return parseInt(character) === 0 || parseInt(character) === 1;
    }
  }
});
