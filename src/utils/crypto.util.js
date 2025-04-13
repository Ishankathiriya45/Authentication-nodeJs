const crypto = require('node:crypto')
const { Buffer } = require('node:buffer')

const password = process.env['ENCRYPTION_SECRET_KEY_' + process.env.RUN_MODE]
const algorithm = process.env['ENCRYPTION_ALGORITHM_' + process.env.RUN_MODE]
const key = crypto.scryptSync(password, "salt", 32);
const iv = Buffer.alloc(16, 0);

module.exports = {
  encryptData: (data) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(data, "utf8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
  },

  decryptData: (data) => {
    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decryptedData = decipher.update(data, "hex", "utf8");
      decryptedData += decipher.final("utf8");
      return decryptedData;
    } catch (error) {
      return null;
    }
  },
}