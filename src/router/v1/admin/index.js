const express = require('express')
const router = express()

router.use('/auth', require('./auth.routes'))
router.use('/bike', require('./bike.routes'))

module.exports = router;