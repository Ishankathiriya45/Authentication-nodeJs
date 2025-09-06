const express = require("express");
const { BuyerModule } = require("../../../controller/v1");
const { validateSchema } = require("../../../middleware");
const { AuthValidator } = require("../../../validation");
const router = express();

const BuyerCtr1 = new BuyerModule.buyerCtr1.AuthController();

router.post(
  "/create",
  validateSchema(AuthValidator.adminAuthValidate.adminRegister),
  async (req, res) => {
    const result = await BuyerCtr1.createBuyer(req, res);
    return res.status(result.status).send(result);
  }
);

module.exports = router;
