const crypto = require("node:crypto");
const { Buffer } = require("node:buffer");

const password = process.env["ENCRYPTION_SECRET_KEY_" + process.env.RUN_MODE];
const algorithm = process.env["ENCRYPTION_ALGORITHM_" + process.env.RUN_MODE];
const key = crypto.scryptSync(password, "salt", 32);
// const iv = Buffer.alloc(16, 0);

module.exports = {
  encryptData: (data) => {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encryptedData = cipher.update(data, "utf8", "hex");
      encryptedData += cipher.final("hex");
      return iv.toString("hex") + ":" + encryptedData;
    } catch (error) {
      return error;
    }
  },

  decryptData: (data) => {
    try {
      const parts = data.split(":");
      if (parts.length != 2) {
        throw new Error("Invalid encrypted data format");
      }

      const tokenData = parts[1];
      const iv = Buffer.from(parts[0], "hex");

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decryptedData = decipher.update(tokenData, "hex", "utf8");
      decryptedData += decipher.final("utf8");
      return decryptedData;
    } catch (error) {
      return error;
    }
  },
};
