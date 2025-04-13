const express = require('express')
const router = express()

router.use('/auth', require('./auth.routes'))

module.exports = router;