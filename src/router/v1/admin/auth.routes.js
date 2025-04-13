const express = require('express');
const { AdminModule } = require('../../../controller/v1');
const { validateSchema } = require('../../../middleware');
const { AuthValidator } = require('../../../validation');
const router = express()

const AuthCtr1 = new AdminModule.authCtr1.AuthController()

router.post('/create',
    validateSchema(AuthValidator.adminAuthValidate.adminRegister),
    async (req, res) => {
        const result = await AuthCtr1.registraion(req, res)
        return res.status(result.status).send(result)
    }
)

router.post('/login',
    validateSchema(AuthValidator.adminAuthValidate.login),
    async (req, res) => {
        const result = await AuthCtr1.login(req, res)
        return res.status(result.status).send(result)
    }
)

module.exports = router;