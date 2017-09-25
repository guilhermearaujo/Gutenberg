const express = require('express');
const bodyParser = require('body-parser');
const TextToSVG = require('text-to-svg');
const CryptoJS = require('crypto-js');

const app = express();
const port = 8000;

const { NODE_ENV, SECRET_KEY } = process.env;

const log = msg => process.stdout.write(`${msg}\n`);

const loadFonts = () => {
  try {
    const fonts = require('./fonts'); // eslint-disable-line global-require

    if (Object.keys(fonts).includes('default')) {
      log(`Loaded custom fonts:\n  ${JSON.stringify(fonts)}`);
      return fonts;
    }

    log('Error: Custom fonts do not define a default. Falling back to default font.');
  } catch (e) {
    log('No custom fonts detected. Using the default font.');
  }

  return undefined;
};

log('\n  "Give me twenty-six soldiers of lead and I will conquer the world."\n\t Johannes Gutenberg\n');
log('Selecting types...');

const fonts = loadFonts();

app.listen(port, () => log(`Ready to press on port ${port}`));

const encrypt = (string, key) => CryptoJS.AES.encrypt(string, key).toString();
const decrypt = (string, key) => CryptoJS.AES.decrypt(string, key).toString(CryptoJS.enc.Utf8);

const getFontNamed = (font) => {
  if (fonts === undefined) { return undefined; }
  return `fonts/${fonts[font] || fonts.default}`;
};

const getOptions = options => Object.assign({ anchor: 'top' }, options);

app.get('/text/:hash', (req, res) => {
  let params;

  try {
    params = JSON.parse(decrypt(decodeURI(req.params.hash), SECRET_KEY));
  } catch (e) {
    res.status(400).send({ error: 'invalid data' });
    return;
  }

  const font = getFontNamed(params.font || '');
  const text = params.text || '';

  res.type('image/svg+xml').send(TextToSVG.loadSync(font).getSVG(text, getOptions(params.options)));
});

if (NODE_ENV === 'development') {
  app.use(bodyParser.json());

  app.post('/encrypt', (req, res) => res.send(encodeURIComponent(encrypt(JSON.stringify(req.body), SECRET_KEY))));
}
