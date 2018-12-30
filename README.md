# kevast-file.js
Encryption middleware for [kevast.js](https://github.com/kevast/kevast.js).

For encryption detail, refer to [crypto-js](https://github.com/brix/crypto-js).

## Installation
### Node.js
Using yarn
```bash
yarn add kevast-encrypt
```

Using npm
```bash
npm install kevast-encrypt
```

### Browser
```html
<script src="https://cdn.jsdelivr.net/npm/kevast-encrypt/dist/index.min.js"></script>
```

## Usage
```javascript
const { Kevast } = require('kevast');
const { KevastEncrypt } = require('kevast-encrypt');
const assert = require('assert');

(async () => {
  const kevast = await Kevast.create();
  kevast.use(new KevastEncrypt(KevastEncrypt.randomKey()));
  await kevast.set('key', 'value');
  console.log(kevast.values());
  assert(kevast.get('key') === 'value');
})();
```
