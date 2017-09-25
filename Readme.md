# Gutenberg

**Gutenberg** is an application that renders text into vector paths as an SVG.  
It works as a web-server, that relies on [text-to-svg](https://github.com/shrhdk/text-to-svg) for the conversion,
and adds a layer of encryption.

## Usage
Start the server: `$ SECRET_KEY=some_random_key npm run dev`

Send a `GET` request to `http://localhost:8000/text/:encrypted_hash`

### Encrypting the request
The `encrypted_hash` is a string that contains all the information you need to generate your SVG.
This is how you generate it:

1. Build a JSON string:
```json
{
  "text": "My Sample Text"
}
```
1. Encode the JSON string using AES encryption. Use the same secret key you use on your back-end.
1. Apply URI encoding

#### Example using Javascript
```javascript
const CryptoJS = require('crypto-js');

const json = { text: 'My Sample Text' };
const encrypted = CryptoJS.AES.encrypt(JSON.stringify(json), 'my_super_secret_key');
const encoded = encodeURIComponent(encrypted.toString());

console.log(encoded); // This goes in the URL
```

### Using custom fonts
By default, text-to-svg uses [IPA font](http://ipafont.ipa.go.jp) as the default font.  
However, you can use whatever font you desire. This is what you need to do:

1. Save your font in the `font/` directory
1. Create a `fonts` module in the root directory like the example below. Save it as `fonts.js`.
```javascript
const fonts = {
  'Arial-Black': 'Arial-Black.ttf',
  'Impact': 'Impact.ttf',
  default: 'Comic-Sans.ttf'
};

module.exports = fonts;
```
The `fonts` keys are the names you will be using in your request. Its values are the names of the files you saved in the
`fonts/` directory.  
**NOTE**: You **must** provide a `default` key, otherwise Gutenber will fallback to its default IPA font.

3. Update your request JSON to choose the font
```json
{
  "text": "My Sample Text",
  "font": "Arial-Black"
}
```

### Further customization
text-to-svg allows you to customize a number of parameters in your text, including color, stroke, size, etc.
Take a look at [its documentation](https://github.com/shrhdk/text-to-svg#texttosvggetsvgtext-options--) for further details.

```json
{
  "text": "Well, this is quite an interesting thing to read.",
  "font": "Avenir",
  "options": {
    "fontSize": 64,
    "attributes": {
      "fill": "#FFDD00",
      "stroke": "#666666"
    }
  }
}
```

## License

Gutenberg is released under the MIT license.
