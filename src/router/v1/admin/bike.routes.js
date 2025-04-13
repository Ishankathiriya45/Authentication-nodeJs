const express = require('express');
const { AdminModule } = require('../../../controller/v1');
const { upload } = require('../../../utils/image.util');
const { bikeAuth, validateSchema } = require('../../../middleware');
const { BikeValidator } = require('../../../validation');
const router = express()

let BikeCtr1 = new AdminModule.bikeCtr1.BikeController()

router.post('/create',
    upload.single('bike_image'),
    bikeAuth,
    validateSchema(BikeValidator.bikeValidate.createBike),
    async (req, res) => {
        const result = await BikeCtr1.createBike(req, res)
        return res.status(result.status).send(result)
    }
)

router.get('/list',
    bikeAuth,
    async (req, res) => {
        const result = await BikeCtr1.getBike(req, res)
        return res.status(result.status).send(result)
    }
)

module.exports = router;