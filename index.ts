import * as crypto from 'crypto-js';
import { DuplexMiddleware } from 'kevast/dist/Middleware';
import { Pair } from 'kevast/dist/Pair';

export class KevastEncrypt implements DuplexMiddleware {
  public static randomKey(length: number = 32): string {
    let result = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
  }
  private key: string;
  public constructor(key: string) {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string.');
    }
    this.key = key;
  }
  public afterGet(pair: Pair) {
    if (typeof pair.value === 'string') {
      let plain: any;
      try {
        plain = crypto.AES.decrypt(pair.value, this.key);
        if (plain.sigBytes < 0) {
          throw new Error();
        }
      } catch (err) {
        throw new Error('Fail to decrypt: wrong key.');
      }
      pair.value = plain.toString(crypto.enc.Utf8);
    }
  }
  public beforeSet(pair: Pair) {
    pair.value = crypto.AES.encrypt(pair.value as string, this.key).toString();
  }
}
