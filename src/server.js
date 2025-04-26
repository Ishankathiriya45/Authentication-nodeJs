const express = require('express')
const db = require('./models')
const app = express()
const path = require('path')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')
const morgan = require('morgan-body')
const moment = require('moment')
require('dotenv').config()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, '../public')))

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    limit: process.env[`REQUEST_LIMIT_${process.env.RUN_MODE}`],
    legacyHeaders: false,
    message: "You have exceeded your requests per minute limit.",
})
app.use(limiter)

let date = moment().utc().format('YYYY-MM-DD')
let logFile = date + '.log';
let logStream = fs.createWriteStream(path.join(__dirname, 'logs', logFile), { flags: 'a' })

const createLog = () => {
    let logFile = date + '.log';
    let logStream = fs.createWriteStream(path.join(__dirname, 'logs', logFile), { flags: 'a' })
}

// morgan(app, {
//     noColors: true,
//     stream: {
//         write: (message) => {
//             if (date != moment().utc().format('YYYY-MM-DD')) {
//                 createLog()
//             } if (logStream) {
//                 logStream.write(message)
//             }
//         }
//     },
//     logAllReqHeader: true,
// })

app.use('/api', require('./router'))

let port = process.env['PORT_' + process.env.RUN_MODE];
app.listen(port, () => {
    console.log(`server is running on ${port} and environment ${process.env.RUN_MODE}`)
})