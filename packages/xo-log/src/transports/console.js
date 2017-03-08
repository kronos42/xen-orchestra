import LEVELS, { NAMES } from '../levels'

// Bind console methods (necessary for browsers)
const debugConsole = (...args) => console.log(...args)
const infoConsole = (...args) => console.info(...args)
const warnConsole = (...args) => console.warn(...args)
const errorConsole = (...args) => console.error(...args)

const { ERROR, INFO, WARN } = LEVELS

const consoleTransport = ({ data, level, namespace, message, time }) => {
  const fn = level < INFO ? debugConsole
    : level < WARN ? infoConsole
    : level < ERROR ? warnConsole
    : errorConsole

  fn(
    '%s - %s - [%s] %s',
    time.toISOString(),
    namespace,
    NAMES[level],
    message
  )
  data != null && fn(data)
}
export default () => consoleTransport
