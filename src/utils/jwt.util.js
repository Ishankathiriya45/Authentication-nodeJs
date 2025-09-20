const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_KEY_DEV: secret_key,
  ACCESS_TOKEN_LIFE_DEV: token_life,
  ACCESS_TOKEN_ALGORITHM_DEV: algorithm,
} = process.env;
const jwtSignOptions = {
  algorithm: algorithm,
  expiresIn: token_life,
};

module.exports = {
  generateToken: (tokenData) => {
    const token = jwt.sign(tokenData, secret_key, jwtSignOptions);
    return token;
  },

  verifyToken: (token) => {
    const verifyToken = jwt.verify(token, secret_key);
    return verifyToken;
  },
};
