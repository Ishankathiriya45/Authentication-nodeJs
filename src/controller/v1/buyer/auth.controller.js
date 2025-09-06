const db = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, serverError } = require("../../../responses/response");
const { messages } = require("../../../constants");
const { responseMsg } = require("../../../responses");
const secrateKey = process.env["ACCESS_TOKEN_KEY_" + process.env.RUN_MODE];
const UserModel = db.User;
const RoleModel = db.Role;
const UserRoleModel = db.UserRole;

class AuthController {
  constructor() {}

  async createBuyer(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      let userData = {
        name: name,
        email: email,
        password: hashPassword,
        phone: phone,
      };

      const detail = await UserModel.create(userData);

      if (detail) {
        let tokenDetail = {
          user_id: detail.user_id,
          role_name: "Buyer",
        };

        let getRole = await RoleModel.findOne({
          where: {
            role: "Buyer",
          },
        });

        let userRoleData = await UserRoleModel.create({
          role_id: getRole.role_id,
          user_id: detail.user_id,
        });

        let token = jwt.sign(tokenDetail, secrateKey, { expiresIn: "1d" });

        return responseMsg.successResponse(
          1,
          "Registration successfully",
          token
        );
      }
    } catch (error) {
      return responseMsg.serverError(
        0,
        messages.internalServerError,
        error.message
      );
    }
  }
}

module.exports = {
  AuthController,
};
