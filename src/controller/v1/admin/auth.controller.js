const db = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, serverError } = require('../../../responses/response');
const { messages } = require('../../../constants');
const secrateKey = process.env['SECRATE_KEY_' + process.env.RUN_MODE]
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

                let token = jwt.sign(tokenDetail, secrateKey, { expiresIn: '1d' })

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

                let token = jwt.sign(tokenData, secrateKey, { expiresIn: '365d' })

                return successResponse(1, 'Login successfully', token)
            }
        } catch (error) {
            return serverError(0, messages.internalServerError, error.message)
        }
    }
}

module.exports = {
    AuthController,
}