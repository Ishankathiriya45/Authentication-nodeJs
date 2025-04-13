const express = require('express')
const db = require('./models')
const app = express()
const path = require('path')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, '../public')))

app.use('/api', require('./router'))

let port = process.env['PORT_' + process.env.RUN_MODE];
app.listen(port, () => {
    console.log(`server is running on ${port} and environment ${process.env.RUN_MODE}`)
})