import { DuplexMiddleware } from 'kevast/dist/Middleware';
import { Pair } from 'kevast/dist/Pair';
// Used by forgePbe
require('node-forge/lib/md5');
const forgePbe = require('node-forge/lib/pbe');
const forgeUtil = require('node-forge/lib/util');
const forgeCipher = require('node-forge/lib/cipher');

export class KevastEncrypt implements DuplexMiddleware {
  public static randomString(length: number = 32): string {
    let result = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
  }
  private password: string;
  public constructor(password: string) {
    if (typeof password !== 'string') {
      throw new TypeError('Password must be a string.');
    }
    this.password = password;
  }
  public afterGet(pair: Pair) {
    if (typeof pair.value === 'string') {
      const decrypted = decrypt(pair.value, this.password);
      pair.value = decrypted;
    }
  }
  public beforeSet(pair: Pair) {
    const encrypted = encrypt(pair.value as string, this.password);
    pair.value = encrypted;
  }
}

// AES 128 CBC
function encrypt(plain: string, password: string): string {
  const input = Buffer.from(plain);
  // AES 128
  const keySize = 16;
  const ivSize = 16;

  const derivedBytes = forgePbe.opensslDeriveBytes(password, null, keySize + ivSize);
  const buffer = forgeUtil.createBuffer(derivedBytes);
  const key = buffer.getBytes(keySize);
  const iv = buffer.getBytes(ivSize);

  const cipher = forgeCipher.createCipher('AES-CBC', key);
  cipher.start({iv});
  cipher.update(forgeUtil.createBuffer(input, 'binary'));
  cipher.finish();

  return cipher.output.toHex();
}

function decrypt(text: string, password: string): string {
  const input = Buffer.from(text, 'hex');
  const inputBuffer = forgeUtil.createBuffer(input, 'binary');

  const keySize = 16;
  const ivSize = 16;

  const derivedBytes = forgePbe.opensslDeriveBytes(password, null, keySize + ivSize);
  const buffer = forgeUtil.createBuffer(derivedBytes);
  const key = buffer.getBytes(keySize);
  const iv = buffer.getBytes(ivSize);

  const decipher = forgeCipher.createDecipher('AES-CBC', key);
  decipher.start({iv});
  decipher.update(inputBuffer);
  const result = decipher.finish();
  return decipher.output.toString();
}
