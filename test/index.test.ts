import assert = require('assert');
import { Kevast } from 'kevast';
import { KevastMemory } from 'kevast-memory';
import { KevastEncrypt } from '../index';

describe('Test basic function', () => {
  let kevast: Kevast;
  let key: string;
  let veryLong: string;
  let map: Map<string, string>;
  before(async () => {
    map = new Map();
    kevast = new Kevast(new KevastMemory(map));
    key = KevastEncrypt.randomKey();
    veryLong = KevastEncrypt.randomKey(10000);
    kevast.use(new KevastEncrypt(key));
  });
  it('Get null or default', async () => {
    assert(await kevast.get('key1') === undefined);
    assert(await kevast.get('key1', 'default') === 'default');
  });
  it('Set normally', async () => {
    await kevast.set('key1', 'value1');
    const actual = map.get('key1');
    assert(actual !== 'value1');
  });
  it('Get normally', async () => {
    assert(await kevast.get('key1') === 'value1');
  });
  it('Set very long value', async () => {
    await kevast.set('key2', veryLong);
    const actual = map.get('key2');
    assert(actual !== veryLong);
  });
  it('Get very long value', async () => {
    assert(await kevast.get('key2') === veryLong);
  });
});
