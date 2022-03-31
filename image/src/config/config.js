const env = require('../utils/env')

module.exports = {
  HOST_NAME: env('HOST_NAME', '127.0.0.1'),
  HOST_PORT: env('HOST_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'McClimate Vicki Encoder'),
}
