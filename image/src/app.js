const { HOST_NAME, HOST_PORT, MODULE_NAME, EXECUTE_SINGLE_COMMAND, SINGLE_COMMAND } = require('./config/config.js')
const fetch = require('node-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const winston = require('winston')
const expressWinston = require('express-winston')
const { execute, isSetterCommand } = require('./utils/encoder')
const { formatTimeDiff } = require('./utils/util')

//initialization
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      /*
    new winston.transports.File({
        filename: 'logs/mclimate_encoder.log'
    })
    */
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false
    }, // optional: allows to skip some log messages based on request and/or response
  })
)
const startTime = Date.now()
//health check
app.get('/health', async (req, res) => {
  res.json({
    serverStatus: 'Running',
    uptime: formatTimeDiff(Date.now(), startTime),
    module: MODULE_NAME,
  })
})
//main post listener
app.post('/', async (req, res) => {
  let json = req.body
  if (!json) {
    res.status(400).json({ status: false, message: 'Payload structure is not valid.' })
  }
  if (EXECUTE_SINGLE_COMMAND == 'no' && !json.command) {
    res.status(400).json({ status: false, message: 'Command is missing.' })
  } else if (EXECUTE_SINGLE_COMMAND == 'no' && isSetterCommand(json.command) && !json.params) {
    res.status(400).json({ status: false, message: 'Parameters are missing.' })
  }
  if (EXECUTE_SINGLE_COMMAND == 'yes' && !json.params) {
    res.status(400).json({ status: false, message: 'Parameters are missing.' })
  }
  let result = false
  if (EXECUTE_SINGLE_COMMAND == 'yes') {
    result = execute(SINGLE_COMMAND, json.params)
  } else {
    result = execute(json.command, json.params)
  }
  if (result === false) {
    res.status(400).json({ status: false, message: 'Bad command or Parameters provided.' })
  }
  // parse data property, and update it
  res.status(200).json({
    status: true,
    data: result,
  })
})

//handle exceptions
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  let errCode = err.status || 401
  res.status(errCode).send({
    status: false,
    message: err.message,
  })
})

if (require.main === module) {
  app.listen(HOST_PORT, HOST_NAME, () => {
    console.log(`${MODULE_NAME} listening on ${HOST_PORT}`)
  })
}
