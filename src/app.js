const {
  EGRESS_URLS,
  INGRESS_HOST,
  INGRESS_PORT,
  MODULE_NAME,
  EXECUTE_SINGLE_COMMAND,
  SINGLE_COMMAND,
} = require('./config/config.js')
const fetch = require('node-fetch')
const express = require('express')
const app = express()
const winston = require('winston')
const expressWinston = require('express-winston')
const { execute, isSetterCommand, hexToBase64 } = require('./utils/encoder')

// initialization
app.use(express.urlencoded({ extended: true }))
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf)
      } catch (e) {
        res.status(400).json({ status: false, message: 'Invalid payload provided.' })
      }
    },
  })
)

// logger
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
// main post listener
app.post('/', async (req, res) => {
  let json = req.body
  if (!json) {
    res.status(400).json({ status: false, message: 'Payload structure is not valid.' })
  }
  /*
  if json.command.params.data is present, it means command came from scheduer
   and only that parts needs encoding otherwise check for json.command.name  
  */
  if (EXECUTE_SINGLE_COMMAND === 'no' && typeof json.command === 'undefined') {
    return res.status(400).json({ status: false, message: 'Command is missing.' })
  }
  let result = false
  let forwardPayload = false
  if (typeof json.command.params.data !== 'undefined') {
    const c = json.command.params.data
    if (isSetterCommand(c.command.name) && typeof c.command.params === 'undefined') {
      return res.status(400).json({ status: false, message: 'Parameters are missing.' })
    }
    result = execute(c.command.name, c.command.params)
    if (result !== false) {
      json.command.params.data = hexToBase64(result)
    }
    forwardPayload = true
  } else {
    if (isSetterCommand(json.command.name) && typeof json.command.params === 'undefined') {
      return res.status(400).json({ status: false, message: 'Parameters are missing.' })
    }
    if (EXECUTE_SINGLE_COMMAND === 'yes') {
      result = execute(SINGLE_COMMAND, json.command.params)
    } else {
      result = execute(json.command.name, json.command.params)
    }
  }
  if (result === false) {
    res.status(400).json({ status: false, message: 'Bad command or Parameters provided.' })
  }
  if (!forwardPayload) {
    json = {
      data: hexToBase64(result),
    }
  }
  if (EGRESS_URLS) {
    const urls = []
    const eUrls = EGRESS_URLS.replace(/ /g, '')
    if (eUrls.indexOf(',') !== -1) {
      urls.push(...eUrls.split(','))
    } else {
      urls.push(eUrls)
    }
    urls.forEach(async url => {
      if (url) {
        const callRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(json),
        })
        if (!callRes.ok) {
          console.error(`Error passing response data to ${url}`)
        }
      }
    })
    return res.status(200).json({ status: true, message: 'Payload processed' })
  } else {
    // parse data property, and update it
    return res.status(200).json({
      status: true,
      data: hexToBase64(result),
    })
  }
})

// handle exceptions
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const errCode = err.status || 401
  res.status(errCode).send({
    status: false,
    message: err.message,
  })
})

if (require.main === module) {
  app.listen(INGRESS_PORT, INGRESS_HOST, () => {
    console.log(`${MODULE_NAME} listening on ${INGRESS_PORT}`)
  })
}
