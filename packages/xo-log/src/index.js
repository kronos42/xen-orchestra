import { isArray, map } from 'lodash'

import LEVELS, { resolve } from './levels'
import transports from './transports'
import { compileGlobPattern } from './utils'

// ===================================================================

export { transports }

const createTransport = config => {
  if (typeof config === 'function') {
    return config
  }

  if (isArray(config)) {
    const transports = map(config, createTransport)
    const { length } = transports
    return function () {
      for (let i = 0; i < length; ++i) {
        transports[i].apply(this, arguments)
      }
    }
  }

  let { filter, transport } = config
  const level = resolve(config.level)

  if (filter !== undefined) {
    if (typeof filter === 'string') {
      const re = compileGlobPattern(filter)
      filter = log => re.test(log.namespace)
    }

    const orig = transport
    transport = function (log) {
      if ((level && level <= log.level) || filter(log)) {
        return orig.apply(this, arguments)
      }
    }
  } else if (level !== undefined) {
    const orig = transport
    transport = function (log) {
      if (log.level >= level) {
        return orig.apply(this, arguments)
      }
    }
  }

  return transport
}

let transport = createTransport([
  {
    // display warnings or above, and all that are enabled via DEBUG env
    filter: process.env.DEBUG,
    level: LEVELS.WARN,

    transport: transports.console()
  }
])

export const configure = config => {
  transport = createTransport(config)
}

// -------------------------------------------------------------------

const bind = (fn, thisArgs) => function () {
  return fn.apply(thisArgs, arguments)
}

const serializeError = error => ({
  message: error.message,
  name: error.name,
  stack: error.stack,
  ...error
})

function Log (data, level, namespace, message, time) {
  if (data !== undefined) {
    const { error } = data
    if (error instanceof Error) {
      data = { ...data, error: serializeError(error) }
    }
  }

  this.data = data
  this.level = level
  this.namespace = namespace
  this.message = message
  this.time = time
}

function Logger (namespace) {
  this._namespace = namespace

  // bind all logging methods
  for (const name in LEVELS) {
    const lowerCase = name.toLowerCase()
    this[lowerCase] = bind(this[lowerCase], this)
  }
}

const { prototype } = Logger

prototype.wrap = function (message, fn) {
  const logger = this
  const warnAndRethrow = error => {
    logger.warn(message, { error })
    throw error
  }
  return function () {
    try {
      const result = fn.apply(this, arguments)
      const then = result != null && result.then
      return typeof then === 'function'
        ? then.call(result, warnAndRethrow)
        : result
    } catch (error) {
      warnAndRethrow(error)
    }
  }
}

for (const name in LEVELS) {
  const level = LEVELS[name]

  prototype[name.toLowerCase()] = function (message, data) {
    transport(new Log(data, level, this._namespace, message, new Date()))
  }
}

const createLogger = namespace => new Logger(namespace)
export { createLogger as default }

// -------------------------------------------------------------------

export const catchGlobalErrors = logger => {
  // catch unhandled rejection
  process.on('unhandledRejection', error => {
    logger.warn('possibly unhandled rejection', { error })
  })

  // catch error events with no listeners
  ;(({ prototype }) => {
    const { emit } = prototype
    prototype.emit = function (event, error) {
      (event === 'error' && !this.listenerCount(event))
        ? logger.error('unhandled error event', { error })
        : emit.apply(this, arguments)
    }
  })(require('events').EventEmitter)

  // catch uncaught exceptions
  process.on('uncaughtException', error => {
    logger.fatal('uncaught exception', { error })
  })
}
