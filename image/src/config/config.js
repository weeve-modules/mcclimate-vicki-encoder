const env = require('../utils/env')

module.exports = {
  HOST_NAME: env('HOST_NAME', '127.0.0.1'),
  HOST_PORT: env('HOST_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'McClimate Vicki Encoder'),
  EGRESS_URL: env('EGRESS_URL', ''),
  EXECUTE_SINGLE_COMMAND: env('EXECUTE_SINGLE_COMMAND', 'no'),
  SINGLE_COMMAND: env('SINGLE_COMMAND', 'setTargetTemperature'),
}
