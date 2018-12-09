import assert = require('assert');
import Kevast = require('kevast');
import KevastMemory = require('kevast-memory');
import KevastEncrypt = require('../index');

describe('Test basic function', () => {
  const kevast = new Kevast(new KevastMemory());
  const key = KevastEncrypt.randomKey();
  let veryLong: string;
  kevast.use(new KevastEncrypt(key));
  it('Get null or default', async () => {
    assert(await kevast.get('key1') === null);
    assert(await kevast.get('key1', 'default') === 'default');
  });
  it('Set normal', async () => {
    await kevast.set('key1', 'value1');
    const onlyOne = [...(await kevast.values())][0];
    assert(onlyOne !== 'value1');
  });
  it('Get normal', async () => {
    assert(await kevast.get('key1') === 'value1');
  });
  it('Set very long value', async () => {
    await kevast.delete('key1');
    veryLong = KevastEncrypt.randomKey(100000);
    await kevast.set('key2', veryLong);
    const onlyOne = [...(await kevast.values())][0];
    assert(onlyOne !== veryLong);
  });
  it('Get very long value', async () => {
    assert(await kevast.get('key2') === veryLong);
  });
});
