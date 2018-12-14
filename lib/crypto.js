const crypto = require('crypto-js');

exports.randomString = length => {
  let result = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
};

exports.encrypt = (plain, key) => {
  return crypto.AES.encrypt(plain, key).toString();
};

exports.decrypt = (encrypted, key) => {
  const result = crypto.AES.decrypt(encrypted, key);
  if (result.sigBytes < 0) {
    throw new Error('Fail to decrypt: wrong key.');
  }
  return result.toString(crypto.enc.Utf8);
};
