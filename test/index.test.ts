import assert = require('assert');
import { Kevast } from 'kevast';
import { KevastMemory } from 'kevast-memory';
import { KevastEncrypt } from '../index';

describe('Test basic function', () => {
  let kevast: Kevast;
  let password: string;
  let veryLong: string;
  let map: Map<string, string>;
  before(async () => {
    map = new Map();
    kevast = new Kevast(new KevastMemory(map));
    password = KevastEncrypt.randomString();
    veryLong = KevastEncrypt.randomString(10000);
    kevast.use(new KevastEncrypt(password));
  });
  it('Construction', () => {
    assert.throws(() => {
      const _ = new KevastEncrypt(1 as any as string);
    }, {
      message: 'Password must be a string.',
    });
  });
  it('Normal condition', async () => {
    assert(await kevast.get('key1') === undefined);
    await kevast.set('key1', 'value1');
    const actual = map.get('key1');
    assert(actual !== 'value1');
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

/* tslint:disable: ban-types */
async function assertThrowsAsync(fn: Function, regExp: RegExp | Function | Object | Error) {
  let f = () => {};
  try {
    await fn();
  } catch (e) {
    f = () => {throw e; };
  } finally {
    assert.throws(f, regExp);
  }
}
