import * as crypto from 'crypto-js';
import { IMiddleware } from 'kevast/dist/Middleware';
import { Pair } from 'kevast/dist/Pair';

export class KevastEncrypt implements IMiddleware {
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
  public onGet(pair: Pair, next: () => void) {
    next();
    if (typeof pair[1] === 'string') {
      const plain: any = crypto.AES.decrypt(pair[1], this.key);
      if (plain.sigBytes < 0) {
        throw new Error('Fail to decrypt: wrong key.');
      }
      pair[1] = plain.toString(crypto.enc.Utf8);
    }
  }
  public async onSet(pair: Pair, _: () => Promise<void>) {
    pair[1] = crypto.AES.encrypt(pair[1], this.key).toString();
  }
}
