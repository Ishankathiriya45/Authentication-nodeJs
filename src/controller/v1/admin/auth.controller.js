const db = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, serverError, failAuthorization, forbidden, notFound } = require('../../../responses/response');
const { messages } = require('../../../constants');
const { where } = require('sequelize');
const accessSecrateKey = process.env['ACCESS_TOKEN_KEY_' + process.env.RUN_MODE]
const refreshSecreteKey = process.env['REFRESH_TOKEN_KEY_' + process.env.RUN_MODE]
const UserModel = db.User;
const RoleModel = db.Role;
const UserRoleModel = db.UserRole;

class AuthController {
    constructor() { }

    async registraion(req, res) {
        try {
            const { name, email, password, phone } = req.body;

            const hashPassword = await bcrypt.hash(password, 10)

            let userData = {
                name: name,
                email: email,
                password: hashPassword,
                phone: phone,
            }

            const detail = await UserModel.create(userData)

            if (detail) {
                let tokenDetail = {
                    user_id: detail.user_id,
                    role_name: 'Admin',
                }

                let getRole = await RoleModel.findOne({
                    where: {
                        role: 'Admin'
                    }
                })

                let userRoleData = await UserRoleModel.create({
                    role_id: getRole.role_id,
                    user_id: detail.user_id,
                })

                let token = jwt.sign(tokenDetail, accessSecrateKey, { expiresIn: '1d' })

                return successResponse(1, 'Registration successfully', token)
            }
        } catch (error) {
            return serverError(0, messages.internalServerError, error.message)
        }
    }

    async login(req, res) {
        try {
            const { name, email, password, phone } = req.body;

            let getUser = await UserModel.findOne({
                where: {
                    email: email,
                }
            })

            const confirePassword = await bcrypt.compare(password, getUser.password)

            let whereCluse = {};

            if (getUser && confirePassword) {
                whereCluse.email = getUser.email;

                let detail = await UserModel.findOne({
                    where: whereCluse,
                    include: [
                        {
                            model: UserRoleModel,
                            include: [{ model: RoleModel }],
                        },
                    ]
                })

                let tokenData = {
                    user_id: getUser.user_id,
                    role_name: detail.UserRole.Role.role,
                }

                let data = jwt.sign(tokenData, accessSecrateKey, { expiresIn: '5m' })
                let refreshToken = jwt.sign(tokenData, refreshSecreteKey, { expiresIn: '365d' })

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,       // Use true in production with HTTPS
                    sameSite: 'Strict', // Adjust for cross-site
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }).status(200).send({ status: 200, responseCode: 1, success: true, message:'success', data, error: null })
            }
        } catch (error) {
            return serverError(0, messages.internalServerError, error.message)
        }
    }

    async refreshToken(req, res) {
        
        const token = req.cookies.refreshToken;

        if (!token) {
            return serverError(0, 'No token')
        }

        const payload = jwt.verify(token, refreshSecreteKey)

        let whereCluse = {};
        whereCluse.user_id = payload.user_id;

        const user = await UserModel.findOne({
            where: whereCluse,
            include: [
                {
                    model: UserRoleModel,
                    include: [
                        {
                            model: RoleModel,
                        }
                    ]
                }
            ]
        })

        let tokenData = {
            user_id: payload.user_id,
            role_name: user.UserRole.Role.role,
        }

        const newAccessToken = jwt.sign(tokenData, accessSecrateKey, { expiresIn: '15m' })
        return successResponse(1, 'Success', newAccessToken)
    }
}

module.exports = {
    AuthController,
}