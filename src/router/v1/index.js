const express = require('express')
const router = express()

router.use('/admin', require('./admin'))
router.use('/buyer', require('./buyer'))

module.exports = router;