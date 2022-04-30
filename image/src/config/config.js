const env = require('../utils/env')

module.exports = {
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8082'),
  MODULE_NAME: env('MODULE_NAME', 'McClimate Vicki Encoder'),
  EGRESS_URL: env('EGRESS_URL', 'http://localhost:8083'),
  EXECUTE_SINGLE_COMMAND: env('EXECUTE_SINGLE_COMMAND', 'no'),
  SINGLE_COMMAND: env('SINGLE_COMMAND', 'setTargetTemperature'),
}
