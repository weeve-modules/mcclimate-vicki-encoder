const env = (key, defaultValue, isBool = false) => {
  if (isBool) return process.env[key] === 'true'
  return process.env[key] || defaultValue
}

module.exports = env
