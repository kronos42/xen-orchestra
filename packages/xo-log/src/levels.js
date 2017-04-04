const LEVELS = {
  // https://github.com/trentm/node-bunyan#levels
  FATAL: 60, // service/app is going to down
  ERROR: 50, // fatal for current action
  WARN: 40, // something went wrong but it's not fatal
  INFO: 30, // detail on unusual but normal operation
  DEBUG: 20
}
export { LEVELS as default }

export const NAMES = {}
for (const name in LEVELS) {
  NAMES[LEVELS[name]] = name
}

export const resolve = level => {
  if (typeof level === 'string') {
    level = LEVELS[level.toUpperCase()]
  }
  return level
}
