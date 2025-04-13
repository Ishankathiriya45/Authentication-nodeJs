const { messages } = require("../../../constants");
const db = require("../../../models");
const { successResponse, serverError, badRequest } = require("../../../responses/response");
const { createMessage, getMessage } = require("../../../utils/common.util");
const BikeModel = db.Bike;

class BikeController {
    constructor() { }

    async getBike(req, res) {
        try {
            const detail = await BikeModel.findAll()

            if (detail) {
                return successResponse(
                    0,
                    getMessage('Lottery'),
                    detail,
                )
            } else {
                return badRequest(messages.noData)
            }
        } catch (error) {
            return serverError(0, messages.internalServerError, error.message)
        }
    }

    async createBike(req, res) {
        try {
            const { tokenpayload: { user_id } } = req.headers;
            const { brand, model, year, price, category, status, description, bike_image } = req.body;

            let bikeData = {
                user_id: user_id,
                brand: brand,
                model: model,
                year: year,
                price: price,
                category: category,
                status: status,
                description: description,
                bike_image: req.file.filename,
            }

            const detail = await BikeModel.create(bikeData)

            if (detail) {
                return successResponse(
                    0,
                    createMessage('Lottery'),
                    detail,
                )
            } else {
                return badRequest(messages.noData)
            }
        } catch (error) {
            return serverError(0, messages.internalServerError, error.message)
        }
    }
}

module.exports = {
    BikeController,
}