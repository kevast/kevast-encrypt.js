import assert = require('assert');
import { Kevast } from 'kevast';
import { KevastEncrypt } from '../index';

describe('Test basic function', () => {
  let kevast: Kevast;
  let key: string;
  let veryLong: string;
  before(async () => {
    kevast = await Kevast.create();
    key = KevastEncrypt.randomKey();
    veryLong = KevastEncrypt.randomKey(100000);
    kevast.use(new KevastEncrypt(key));
  });
  it('Get null or default', () => {
    assert(kevast.get('key1') === null);
    assert(kevast.get('key1', 'default') === 'default');
  });
  it('Set normal', async () => {
    await kevast.set('key1', 'value1');
    const onlyOne = [...kevast.values()][0];
    assert(onlyOne !== 'value1');
  });
  it('Get normal', () => {
    assert(kevast.get('key1') === 'value1');
  });
  it('Set very long value', async () => {
    await kevast.delete('key1');
    await kevast.set('key2', veryLong);
    const onlyOne = [...kevast.values()][0];
    assert(onlyOne !== veryLong);
  });
  it('Get very long value', async () => {
    assert(kevast.get('key2') === veryLong);
  });
});
