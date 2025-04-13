const { where } = require("sequelize");
const db = require("../models");

const UserModel = db.User;

class UserService{
    findById = async(userId)=>{
        return await UserModel.findOne({
            where:{
                user_id: userId,
            }
        })
    }
}

module.exports = UserService;