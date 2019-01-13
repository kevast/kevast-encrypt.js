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
        const base64 = crypto.enc.Base64.parse(pair.value).toString(crypto.enc.Utf8);
        plain = crypto.AES.decrypt(base64, this.key);
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
    const encrypted = crypto.AES.encrypt(pair.value as string, this.key).toString();
    pair.value = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encrypted));
  }
}
