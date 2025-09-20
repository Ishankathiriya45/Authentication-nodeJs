const { CommonUtil } = require("../utils");
const { messages } = require("../constants");
const {
  serverError,
  failAuthorization,
  validationError,
  forbidden,
} = require("../responses/response");
const { UserService } = require("../service");
const {
  CryptoUtil: { decryptData },
  JwtUtil: { verifyToken },
} = require("../utils");
const userService = new UserService();

const bearerToken = async (req) => {
  const { authorization } = req.headers;

  if (CommonUtil.isEmpty(authorization)) {
    return {
      valid: false,
      message: messages.bearerNotFound,
    };
  }

  const parts = authorization.split(" ");
  const token = parts[1];
  const tokenPart = token?.split(".");

  if (
    parts.length != 2 ||
    !/^Bearer$/i.test(parts[0]) ||
    tokenPart.length != 3
  ) {
    return {
      valid: false,
      message: "Token error",
    };
  }

  try {
    if (token) {
      const decoded = verifyToken(token);
      req.headers.tokenpayload = decoded;
      return {
        valid: true,
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: error,
    };
  }
};

const checkRequest = async (req) => {
  const { requesttoken } = req.headers;

  if (!requesttoken) {
    return {
      valid: false,
      message: "Request token not found",
    };
  }

  const plainText = decryptData(requesttoken);

  if (plainText == null) {
    return {
      valid: false,
      message: "Token is invalid",
    };
  }

  const requestText = plainText.trim().toLowerCase();

  const encryptionMsg =
    process.env["ENCRYPTION_MESSAGE_" + process.env.RUN_MODE];

  requestText == encryptionMsg;

  return {
    valid: true,
  };
};

const checkRequestToken = async (req, res, next) => {
  try {
    const isRequest = await checkRequest(req);
    if (isRequest.valid == true) {
      next();
    } else {
      return res
        .status(500)
        .send(
          serverError(
            0,
            isRequest.message ? isRequest.message : "Invalid request token",
            null
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .send(failAuthorization(0, "Invalid request token", null));
  }
};

const checkAuth = async (req, res, next, role) => {
  try {
    const checkBearerToken = await bearerToken(req);

    if ((await checkRequest(req)) == true || checkBearerToken.valid == true) {
      const {
        tokenpayload: { user_id, role_name },
      } = req.headers;

      if (!role.includes(role_name)) {
        return res
          .status(400)
          .send(serverError(0, messages.invalidRole, error));
      }

      const user = userService.findById(user_id);

      if (!user) {
        return res.status(400).send(serverError(0, messages.noData, error));
      }
      next();
    } else {
      return res
        .status(403)
        .send(
          forbidden(
            0,
            checkBearerToken.message
              ? checkBearerToken.message
              : messages.invalidToken,
            null,
            {}
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .send(serverError(0, messages.internalServerError, {}, error));
  }
};

const bikeAuth = async (req, res, next) => {
  return checkAuth(req, res, next, ["Admin"]);
};

const tokenAuth = async (req, res, next) => {
  return checkAuth(req, res, next, ["Admin"]);
};

const validateSchema = (schema, fileKey) => {
  return (req, res, next) => {
    const validationData = { ...req.body };

    if (fileKey) {
      validationData[fileKey] = req.file ? req.file : req.files;
    }

    const { error } = schema.validate(validationData);
    if (!error) {
      next();
    } else {
      const message = error?.details.map((detail) => detail.message).join(",");
      res.status(422).send(validationError(0, message, null));
    }
  };
};

module.exports = {
  bearerToken,
  checkAuth,
  bikeAuth,
  tokenAuth,
  checkRequestToken,
  validateSchema,
};
