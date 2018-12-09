import * as crypto from 'crypto';
import {IDuplexMiddleware} from 'kevast/dist/nodejs/Middleware';
import {Pair} from 'kevast/dist/nodejs/Pair';
import * as stream from 'stream';

export = class KevastEncrypt implements IDuplexMiddleware {
  public static randomKey(length: number = 32): string {
    return crypto.randomBytes(length / 2).toString('hex');
  }
  private algorithm: string;
  private key: string | Buffer | NodeJS.TypedArray | DataView;
  private iv: string | Buffer | NodeJS.TypedArray | DataView;
  private options: stream.TransformOptions;
  public constructor(
    key: string | Buffer | NodeJS.TypedArray | DataView,
    algorithm: string = 'aes-256-cbc',
    iv: string | Buffer | NodeJS.TypedArray | DataView = crypto.randomBytes(16),
    options: stream.TransformOptions = null,
  ) {
    crypto.createCipheriv(algorithm, key, iv, options);
    this.algorithm = algorithm;
    this.key = key;
    this.iv = iv;
    this.options = options;
  }
  public async onGet(pair: Pair, next: () => Promise<void>) {
    await next();
    if (typeof pair[1] === 'string') {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv, this.options);
      let plainBuffer = decipher.update(pair[1], 'hex');
      plainBuffer = Buffer.concat([plainBuffer, decipher.final()]);
      const plain = plainBuffer.toString('utf8');
      pair[1] = plain;
    }
  }
  public async onSet(pair: Pair, next: () => Promise<void>) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv, this.options);
    let encrypted = cipher.update(pair[1], 'utf8', 'hex');
    encrypted += cipher.final('hex');
    pair[1] = encrypted;
  }};
