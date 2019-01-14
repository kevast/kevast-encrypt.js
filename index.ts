import { DuplexMiddleware } from 'kevast/dist/Middleware';
import { Pair } from 'kevast/dist/Pair';
const forge = require('node-forge');

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

  // const salt = forge.random.getBytesSync(8);
  const derivedBytes = forge.pbe.opensslDeriveBytes(password, null, keySize + ivSize);
  const buffer = forge.util.createBuffer(derivedBytes);
  const key = buffer.getBytes(keySize);
  const iv = buffer.getBytes(ivSize);

  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({iv});
  cipher.update(forge.util.createBuffer(input, 'binary'));
  cipher.finish();

  // const output = forge.util.createBuffer();
  // output.putBytes('Salted__');
  // output.putBytes(salt);
  // output.putBuffer(cipher.output);
  // return output.toHex();
  return cipher.output.toHex();
}

function decrypt(text: string, password: string): string {
  const input = Buffer.from(text, 'hex');
  const inputBuffer = forge.util.createBuffer(input, 'binary');
  // inputBuffer.getBytes('Salted__'.length);
  // const salt = inputBuffer.getBytes(8);

  const keySize = 16;
  const ivSize = 16;

  const derivedBytes = forge.pbe.opensslDeriveBytes(password, null, keySize + ivSize);
  const buffer = forge.util.createBuffer(derivedBytes);
  const key = buffer.getBytes(keySize);
  const iv = buffer.getBytes(ivSize);

  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({iv});
  decipher.update(inputBuffer);
  const result = decipher.finish();
  if (!result) {
    throw new Error('Fail to decrypt: wrong password.');
  }
  let plain: string = '';
  try {
    plain = decipher.output.toString();
  } catch (err) {
    if (err.message === 'URI malformed') {
      throw new Error('Fail to decrypt: wrong password.');
    }
  }
  return plain;
}
