import { escapeRegExp, noop } from 'lodash'

// ===================================================================

const TPL_RE = /\{\{(.+?)\}\}/g
export const evalTemplate = (tpl, data) => {
  const getData = data == null
    ? noop
    : typeof data === 'function'
      ? (_, key) => data(key)
      : (_, key) => data[key]

  return tpl.replace(TPL_RE, getData)
}

// -------------------------------------------------------------------

const compileGlobPatternFragment = pattern =>
  pattern.split('*').map(escapeRegExp).join('.*')

export const compileGlobPattern = pattern => {
  const no = []
  const yes = []
  pattern.split(/[\s,]+/).forEach(pattern => {
    if (pattern[0] === '-') {
      no.push(pattern.slice(1))
    } else {
      yes.push(pattern)
    }
  })

  const raw = [ '^' ]

  if (no.length) {
    raw.push(
      '(?!',
      no.map(compileGlobPatternFragment).join('|'),
      ')'
    )
  }

  if (yes.length) {
    raw.push(
      '(?:',
      yes.map(compileGlobPatternFragment).join('|'),
      ')'
    )
  } else {
    raw.push('.*')
  }

  raw.push('$')

  return new RegExp(raw.join(''))
}

// -------------------------------------------------------------------

export const required = name => {
  throw new Error(`missing required arg ${name}`)
}
