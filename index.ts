import { IDuplexMiddleware } from 'kevast/dist/nodejs/Middleware';
import { Pair } from 'kevast/dist/nodejs/Pair';
import * as crypto from './lib/crypto';

export = class KevastEncrypt implements IDuplexMiddleware {
  public static randomKey(length: number = 32): string {
    return crypto.randomString(length);
  }
  private key: string;
  public constructor(key: string) {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string.');
    }
    this.key = key;
  }
  public async onGet(pair: Pair, next: () => Promise<void>) {
    await next();
    if (typeof pair[1] === 'string') {
      const plain = crypto.decrypt(pair[1], this.key);
      pair[1] = plain;
    }
  }
  public async onSet(pair: Pair, next: () => Promise<void>) {
    const encrypted = crypto.encrypt(pair[1], this.key);
    pair[1] = encrypted;
  }};
