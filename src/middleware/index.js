const jwt = require('jsonwebtoken');
const { permission } = require('../utils/constant');
const { CommonUtil } = require('../utils');
const { messages } = require('../constants');
const { serverError, badRequest, failAuthorization, validationError, forbidden } = require('../responses/response');
const { UserService } = require('../service');
const cryptoUtil = require('../utils/crypto.util');
const accessSecrateKey = process.env['ACCESS_TOKEN_KEY_' + process.env.RUN_MODE]
const refreshSecreteKey = process.env['REFRESH_TOKEN_KEY_' + process.env.RUN_MODE]
const userService = new UserService();

const bearerToken = async (req, res) => {
    const { authorization } = req.headers;

    if (CommonUtil.isEmpty(authorization)) {
        return {
            valid: false,
            message: messages.bearerNotFound,
        }
    }

    const parts = authorization.split(' ');
    const token = parts[1];
    const tokenPart = token?.split('.');

    if (parts.length != 2 || !/^Bearer$/i.test(parts[0]) || tokenPart.length != 3) {
        return {
            valid: false,
            message: 'Token error',
        }
    }

    try {
        if (token) {
            const decoded = jwt.verify(token, accessSecrateKey)
            req.headers.tokenpayload = decoded;
            return {
                valid: true,
            }
        }
    } catch (error) {
        return {
            valid: false,
            message: error,
        }
    }
}

const checkRequest = async (req, res) => {
    const { requesttoken } = req.headers;

    if (!requesttoken) {
        return false;
    }

    const plainText = cryptoUtil.decryptData(requesttoken)

    if (plainText == null) {
        return false;
    }

    const requestText = plainText.trim().toLowerCase()

    const encryptionMsg = process.env['ENCRYPTION_MESSAGE_' + process.env.RUN_MODE];

    requestText == encryptionMsg;

    return true;
}

const checkAuth = async (req, res, next, role) => {
    try {
        const checkBearerToken = await bearerToken(req, res)

        if ((await checkRequest(req, res) == true) || checkBearerToken.valid == true) {

            const { tokenpayload: { user_id, role_name } } = req.headers;

            if (!role.includes(role_name)) {
                return res.status(400).send(serverError(0, messages.invalidRole, error))
            }

            const user = userService.findById(user_id)

            if (!user) {
                return res.status(400).send(serverError(0, messages.noData, error))
            }
            next()
        } else {
            return res.status(403).send(forbidden(0,
                checkBearerToken.message ? checkBearerToken.message : messages.invalidToken,
                null,
                {},
            ))
        }
    } catch (error) {
        return res.status(500).send(serverError(0, messages.internalServerError, {}, error))
    }
}

const bikeAuth = async (req, res, next) => {
    return checkAuth(req, res, next, ['Admin']);
}

const tokenAuth = async (req, res, next) => {
    return checkAuth(req, res, next, ['Admin']);
}

const validateSchema = (schema, fileKey) => {
    return (req, res, next) => {
        const validationData = { ...req.body };

        if (fileKey) {
            validationData[fileKey] = req.file ? req.file : req.files;
        }

        const { error } = schema.validate(validationData)
        if (!error) {
            next()
        } else {
            const message = error?.details.map((detail) => detail.message).join(',')
            res.status(422).send(validationError(0, message, null))
        }
    }
}

module.exports = {
    bearerToken,
    checkAuth,
    bikeAuth,
    tokenAuth,
    checkRequest,
    validateSchema,
}