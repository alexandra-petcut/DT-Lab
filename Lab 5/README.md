# Baseband Encoder - DT Lab 5

Small static web app for DT Laboratory 5, section **Data Encoding Techniques**.

It represents a bit stream using common baseband encoding techniques, including:

- NRZ-L, NRZ-M, NRZ-S
- RZ unipolar and bipolar
- Manchester / Biphase codes
- AMI, HDB-3, B8ZS
- 4B/5B NRZI
- MLT-3

## How to Run

Open `index.html` in a browser, or start a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

## Project Files

- `index.html` - main page
- `css/style.css` - styling
- `js/helpers.js` - bit validation and formatting helpers
- `js/baseband-codes.js` - encoding algorithms
- `js/app.js` - UI rendering logic
- `LAB_WORK_SOLUTIONS.md` - written lab exercise solutions

## Notes

The app uses plain HTML, CSS, and JavaScript. No npm install is required.
