const formatTimeDiff = (t1, t2) => {
  const diff = Math.max(t1, t2) - Math.min(t1, t2)
  const SEC = 1000
  const MIN = 60 * SEC
  const HRS = 60 * MIN
  const hrs = Math.floor(diff / HRS)
  const min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 2 })
  const sec = Math.floor((diff % MIN) / SEC).toLocaleString('en-US', { minimumIntegerDigits: 2 })
  return `${hrs}:${min}:${sec}`
}
module.exports = {
  formatTimeDiff,
}
