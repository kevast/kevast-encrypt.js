import * as crypto from 'crypto-js';
import { IDuplexMiddleware } from 'kevast/dist/nodejs/Middleware';
import { Pair } from 'kevast/dist/nodejs/Pair';

export = class KevastEncrypt implements IDuplexMiddleware {
  public static randomKey(length: number = 32): string {
    return crypto.lib.WordArray.random(length / 2).toString();
  }
  private key: string;
  private mode: crypto.Mode;
  public constructor(key: string, mode: crypto.Mode = crypto.mode.CBC) {
    this.key = key;
    this.mode = mode;
  }
  public async onGet(pair: Pair, next: () => Promise<void>) {
    await next();
    if (typeof pair[1] === 'string') {
      const plain = crypto.AES.decrypt(pair[1], this.key, {
        mode: this.mode,
      }).toString(crypto.enc.Utf8);
      pair[1] = plain;
    }
  }
  public async onSet(pair: Pair, next: () => Promise<void>) {
    const encrypted = crypto.AES.encrypt(pair[1], this.key, {
      mode: this.mode,
    }).toString();
    pair[1] = encrypted;
  }};
