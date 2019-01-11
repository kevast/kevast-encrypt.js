# kevast-file.js
[![Build Status](https://img.shields.io/travis/kevast/kevast-encrypt.js.svg?style=flat-square)](https://travis-ci.org/kevast/kevast-encrypt.js)
[![Coverage Status](https://img.shields.io/coveralls/github/kevast/kevast-encrypt.js.svg?style=flat-square)](https://coveralls.io/github/kevast/kevast-encrypt.js?branch=master)
[![Dependencies](https://img.shields.io/david/kevast/kevast-encrypt.js.svg?style=flat-square)](https://david-dm.org/kevast/kevast-encrypt.js)
[![Dev Dependencies](https://img.shields.io/david/dev/kevast/kevast-encrypt.js.svg?style=flat-square)](https://david-dm.org/kevast/kevast-encrypt.js?type=dev)
[![Package Version](https://img.shields.io/npm/v/kevast-encrypt.svg?style=flat-square)](https://www.npmjs.com/package/kevast-encrypt)
[![Open Issues](https://img.shields.io/github/issues-raw/kevast/kevast-encrypt.js.svg?style=flat-square)](https://github.com/kevast/kevast-encrypt.js/issues)
[![MIT License](https://img.shields.io/npm/l/kevast-encrypt.svg?style=flat-square)](https://github.com/kevast/kevast-encrypt.js/blob/master/LICENSE)

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
const { KevastMemory } = require('kevast-memory');
const { KevastEncrypt } = require('kevast-encrypt');
const assert = require('assert');

(async () => {
  const map = new Map();
  const kevast = new Kevast(new KevastMemory(map));
  kevast.use(new KevastEncrypt(KevastEncrypt.randomKey()));
  await kevast.set('key', 'value');
  console.log(map);
  assert(await kevast.get('key') === 'value');
})();
```
