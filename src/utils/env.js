const env = (key, defaultValue, isBoll = false) => {
  if (isBoll) return process.env[key] === 'true'
  return process.env[key] || defaultValue
}

module.exports = env
