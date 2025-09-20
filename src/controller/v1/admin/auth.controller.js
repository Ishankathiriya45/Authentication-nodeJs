const db = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { messages } = require("../../../constants");
const { where } = require("sequelize");
const { generateOtp } = require("../../../helper/common");
const { mailSend } = require("../../../service/mail.service");
const { responseMsg } = require("../../../responses");
const eventHandler = require("../../../handler/event.handler");
const {
  CommonUtil: { getDynamicContent },
  DateUtil: { getEpochFromDate },
} = require("../../../utils");
const Crypto = require("crypto");
const { mailForgot } = require("../../../service/forgot-password.service");
const accessSecrateKey =
  process.env["ACCESS_TOKEN_KEY_" + process.env.RUN_MODE];
const refreshSecreteKey =
  process.env["REFRESH_TOKEN_KEY_" + process.env.RUN_MODE];
const UserModel = db.User;
const RoleModel = db.Role;
const UserRoleModel = db.UserRole;
const OtpModel = db.Otp;
const ResetTokenModel = db.ResetToken;

class AuthController {
  constructor() {}

  async registraion(req, res) {
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
          role_name: "Admin",
        };

        let getRole = await RoleModel.findOne({
          where: {
            role: "Admin",
          },
        });

        let userRoleData = await UserRoleModel.create({
          role_id: getRole.role_id,
          user_id: detail.user_id,
        });

        let token = jwt.sign(tokenDetail, accessSecrateKey, {
          expiresIn: "1d",
        });

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

  async login(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      let getUser = await UserModel.findOne({
        where: {
          email: email,
        },
      });
      const confirePassword = await bcrypt.compare(password, getUser.password);

      let whereCluse = {};

      // this.sendOtp(getUser.email)

      if (getUser && confirePassword) {
        whereCluse.email = getUser.email;

        let detail = await UserModel.findOne({
          where: whereCluse,
          include: [
            {
              model: UserRoleModel,
              include: [{ model: RoleModel }],
            },
          ],
        });

        let tokenData = {
          user_id: getUser.user_id,
          role_name: detail.UserRole.Role.role,
        };

        let data = jwt.sign(tokenData, accessSecrateKey, { expiresIn: "5m" });
        let refreshToken = jwt.sign(tokenData, refreshSecreteKey, {
          expiresIn: "365d",
        });

        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Use true in production with HTTPS
            sameSite: "Strict", // Adjust for cross-site
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          })
          .status(200)
          .send({
            status: 200,
            responseCode: 1,
            success: true,
            message: "success",
            data,
            error: null,
          });
      } else {
        return res
          .status(422)
          .send(responseMsg.validationError(0, "Invalid email and password"));
      }
    } catch (error) {
      return res
        .status(500)
        .send(
          responseMsg.serverError(
            0,
            messages.internalServerError,
            error.message
          )
        );
    }
  }

  async refreshToken(req, res) {
    const token = req.cookies.refreshToken;

    if (!token) {
      return responseMsg.serverError(0, "No token");
    }

    const payload = jwt.verify(token, refreshSecreteKey);

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
            },
          ],
        },
      ],
    });

    let tokenData = {
      user_id: payload.user_id,
      role_name: user.UserRole.Role.role,
    };

    const newAccessToken = jwt.sign(tokenData, accessSecrateKey, {
      expiresIn: "15m",
    });
    return responseMsg.successResponse(1, "Success", newAccessToken);
  }

  async sendOtp(req) {
    try {
      let { email, type, isMailUpdate = true } = req.body;

      let getEmail = await UserModel.findOne({
        where: {
          email: email,
        },
      });

      if (!getEmail) {
        return responseMsg.notFound(0, "User not found");
      }

      let otp = generateOtp();

      let otpData = {
        USER_NAME: getEmail.name,
        OTP: otp,
      };

      await OtpModel.create({
        email,
        otp,
        otp_send_date: getEpochFromDate(new Date()),
      });

      const subject = getDynamicContent(
        type == "Email"
          ? isMailUpdate == true
            ? "email-updated-subject"
            : "email-verification-subject"
          : "forgot-password-subject",
        null,
        "emailContent"
      );

      const body = getDynamicContent(
        type == "Email"
          ? isMailUpdate == true
            ? "email-updated-body"
            : "email-verification-body"
          : "forgot-password-body",
        otpData,
        "emailContent"
      );

      eventHandler.emit("send-mail", { email, subject, body });

      return responseMsg.successResponse(1, "Otp send successfully", null);
    } catch (error) {
      return responseMsg.serverError(0, "Something went wrong", error.message);
    }
  }

  async forgotPassword(req) {
    try {
      const { email } = req.body;

      let getUser = await UserModel.findOne({
        where: {
          email: email,
        },
      });

      if (!getUser) {
        return responseMsg.validationError(0, "User not found");
      }

      let token = Crypto.randomBytes(32).toString("hex");

      let resetTokenData = {
        email: email,
        token: token,
      };

      let detail = await ResetTokenModel.create(resetTokenData);

      if (detail) {
        let passwordDetail = {
          email: detail.email,
          token: detail.token,
          subject: "Reset your password",
        };

        let passwordResponse = await mailForgot(passwordDetail);

        if (passwordResponse) {
          return responseMsg.successResponse(1, "Success", passwordResponse);
        } else {
          return responseMsg.validationError(0, "Failed");
        }
      }
    } catch (error) {
      return responseMsg.serverError(0, "Something went wrong", error.message);
    }
  }

  async resetPassword(req) {
    const { token } = req.params;
    const { password } = req.body;

    let getToken = await ResetTokenModel.findOne({
      where: {
        token: token,
      },
    });

    if (!getToken) {
      return responseMsg.validationError(0, "Invalid or expired token");
    }

    let newHashPassword = await bcrypt.hash(password, 10);

    await UserModel.update(
      { password: newHashPassword },
      { where: { email: getToken.email } }
    );

    await ResetTokenModel.destroy({
      where: {
        token: token,
      },
    });

    return responseMsg.successResponse(1, "Password reset successfully");
  }
}

module.exports = {
  AuthController,
};
