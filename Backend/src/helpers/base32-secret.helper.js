const crypto = require('crypto');
const base32 = require('base32.js');

const Base32SecretHelper = module.exports;

Base32SecretHelper.generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  const encoder = new base32.Encoder();
  const base32Secret = encoder.write(buffer).finalize();
  return base32Secret.replace(/=/g, "").substring(0, 24);
};
