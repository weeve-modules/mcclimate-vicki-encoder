/*
Decoder documentation:
https://docs.mclimate.eu/mclimate-lorawan-devices/devices/mclimate-vicki-lorawan/downlink-encoder

*/
const decToHex = (integer, shouldAddZero = true) => {
  let number = (+integer).toString(16).toUpperCase()
  if (number.length % 2 > 0 && shouldAddZero) {
    number = '0' + number
  }
  return number
}
const dec2hexWithZero = i => {
  return (i + 0x10000).toString(16).substr(-4).toUpperCase()
}
const toHex = (cmdName, cmdId, ...params) => {
  if (cmdName == 'SetOpenWindow')
    return (
      cmdId.toString(16).padStart(2, '0') +
      params.reduce((paramString, param) => {
        return (paramString += param)
      }, '')
    )
  else
    return (
      cmdId.toString(16).padStart(2, '0') +
      params.reduce((paramString, param) => {
        return (paramString += param.padStart(2, '0'))
      }, '')
    )
}

const forceClose = () => {
  return toHex('ForceClose', 0x0b)
}

const getAllParams = () => {
  return toHex('GetAllParams', '14', '16', '17', '12', '13', '18', '19', '15', '1B')
}

const getChildLock = () => {
  return toHex('GetChildLock', 0x14)
}

const getInternalAlgoParams = () => {
  return toHex('GetInternalAlgoParams', 0x16)
}

const getInternalAlgoTdiffParams = () => {
  return toHex('GetInternalAlgoTdiffParams', 0x17)
}

const getJoinRetryPeriod = () => {
  return toHex('GetJoinRetryPeriod', 0x19)
}

const getKeepAliveTime = () => {
  return toHex('GetKeepAliveTime', 0x12)
}

const getOpenWindowParams = () => {
  return toHex('GetOpenWindowParams', 0x13)
}

const getOperationalMode = () => {
  return toHex('GetOperationalMode', 0x18)
}

const getTemperatureRange = () => {
  return toHex('GetTemperatureRange', 0x15)
}

const getUplinkType = () => {
  return toHex('GetUplinkType', 0x1b)
}

const recalibrateMotor = () => {
  return toHex('RecalibrateMotor', 0x03)
}

const receivedKeepaliveCommand = () => {
  return toHex('ReceivedKeepalive', 0x55)
}

const sendCustomHexCommand = command => {
  return toHex('SendCustomHexCommand', command)
}

const setChildLock = enabled => {
  let enabledValue = enabled ? 1 : 0
  return toHex('SetChildLock', 0x07, decToHex(enabledValue))
}

const setInternalAlgoParams = (period, pFirstLast, pNext) => {
  return toHex('SetInternalAlgoParams', 0x0c, decToHex(period), decToHex(pFirstLast), decToHex(pNext))
}

const setInternalAlgoTdiffParams = (cold, warm) => {
  return toHex('SetInternalAlgoTdiffParams', 0x1a, decToHex(cold), decToHex(warm))
}

const setJoinRetryPeriod = period => {
  // period should be passed in minutes
  let periodToPass = (period * 60) / 5
  return toHex('SetJoinRetryPeriod', 0x10, parseInt(periodToPass).toString(16))
}

const setKeepAlive = time => {
  return toHex('SetKeepAlive', 0x02, parseInt(time).toString(16))
}

const setOpenWindow = (enabled, delta, closeTime, motorPosition) => {
  let enabledValue = enabled ? 1 : 0
  let closeTimeValue = parseInt(closeTime) / 5
  let motorPositionBin = `000000000000${parseInt(motorPosition, 10).toString(2)}`
  motorPositionBin = motorPositionBin.substr(-12)
  let motorPositionFirstPart = parseInt(motorPositionBin.substr(4), 2, 16)
  let motorPositionSecondPart = parseInt(motorPositionBin.substr(0, 4), 2, 16)

  return toHex(
    'SetOpenWindow',
    0x06,
    decToHex(enabledValue),
    decToHex(closeTimeValue),
    decToHex(motorPositionFirstPart, false),
    decToHex(motorPositionSecondPart, false),
    decToHex(delta, false)
  )
}

const setOperationalMode = mode => {
  return toHex('SetOperationalMode', 0x0d, mode)
}

const setTargetTemperature = targetTemperature => {
  return toHex('SetTargetTemperature', 0x0e, decToHex(targetTemperature))
}

const setTargetTemperatureAndMotorPosition = (motorPosition, targetTemperature) => {
  return toHex(
    'SetTargetTemperatureAndMotorPosition',
    0x31,
    dec2hexWithZero(motorPosition),
    decToHex(targetTemperature)
  )
}

const setTemperatureRange = (min, max) => {
  return toHex('SetTemperatureRange', 0x08, decToHex(min), decToHex(max))
}

const setUplinkType = type => {
  return toHex('SetUplinkType', 0x11, type)
}

const commands = {
  forceClose,
  getAllParams,
  getChildLock,
  getInternalAlgoParams,
  getInternalAlgoTdiffParams,
  getJoinRetryPeriod,
  getKeepAliveTime,
  getOpenWindowParams,
  getOpenWindowParams,
  getOperationalMode,
  getTemperatureRange,
  getUplinkType,
  recalibrateMotor,
  receivedKeepaliveCommand,
  //set functions
  sendCustomHexCommand,
  setChildLock,
  setInternalAlgoParams,
  setInternalAlgoTdiffParams,
  setJoinRetryPeriod,
  setKeepAlive,
  setOpenWindow,
  setOperationalMode,
  setTargetTemperature,
  setTargetTemperatureAndMotorPosition,
  setTemperatureRange,
  setUplinkType,
}
const isSetterCommand = command => {
  return command.includes('set')
}
const execute = (command, params) => {
  if (!isSetterCommand(command)) {
    if (commands[command]) return commands[command]()
    else return false
  } else {
    //first check if any key is null for "set" commands, if yes, return false
    let keys = Object.keys(params)
    keys.forEach(key => {
      if (params[key] == undefined || params[key] == null) {
        return false
      }
    })
    switch (command) {
      case 'sendCustomHexCommand':
        if (!keys.includes('command')) return false
        else return commands[command](params.command)
        break
      case 'setChildLock':
        if (!keys.includes('enabled')) return false
        else return commands[command](params.enabled)
        break
      case 'setInternalAlgoParams':
        if (!keys.includes('period') || !keys.includes('pFirstLast') || !keys.includes('pNext')) return false
        else return commands[command](params.period, params.pFirstLast, params.pNext)
        break
      case 'setInternalAlgoTdiffParams':
        if (!keys.includes('cold') || !keys.includes('warm')) return false
        else return commands[command](params.cold, params.warm)
        break
      case 'setJoinRetryPeriod':
        if (!keys.includes('period')) return false
        else return commands[command](params.period)
        break
      case 'setKeepAlive':
        if (!keys.includes('time')) return false
        else return commands[command](params.time)
        break
      case 'setOpenWindow':
        if (
          !keys.includes('enabled') ||
          !keys.includes('delta') ||
          !keys.includes('closeTime') ||
          !keys.includes('motorPosition')
        )
          return false
        else return commands[command](params.enabled, params.delta, params.closeTime, params.motorPosition)
        break
      case 'setOperationalMode':
        if (!keys.includes('mode')) return false
        else return commands[command](params.mode)
        break
      case 'setTargetTemperature':
        if (!keys.includes('targetTemperature')) return false
        else return commands[command](params.targetTemperature)
        break
      case 'setTargetTemperatureAndMotorPosition':
        if (!keys.includes('motorPosition') || !keys.includes('targetTemperature')) return false
        else return commands[command](params.motorPosition, params.targetTemperature)
        break
      case 'setTemperatureRange':
        if (!keys.includes('min') || !keys.includes('max')) return false
        else return commands[command](params.min, params.max)
        break
      case 'setUplinkType':
        if (!keys.includes('type')) return false
        else return commands[command](params.type)
        break
    }
    // command not found
    return false
  }
}

const hexToBase64 = hexstring => {
  var isHex = /^[0-9a-fA-F]+$/
  if (isHex.test(hexstring)) {
    return Buffer.from(hexstring
      .match(/\w{2}/g)
      .map(function (a) {
        return String.fromCharCode(parseInt(a, 16))
      })
      .join('')).toString('base64')
  } else return hexstring
}

module.exports = {
  execute,
  isSetterCommand,
  hexToBase64,
}
