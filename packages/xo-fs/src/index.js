import handlers from './handlers'
import { parse } from 'xo-remote-parser'

const getRemotehandler = url => {
  // if it's a remote record, get its URL
  const parsed = parse(url.url || url)

  const { type } = parsed
  const Handler = handlers[type]
  if (!Handler) {
    throw new Error(`no handler available for type ${type}`)
  }

  return new Handler(parsed)
}
export { getRemotehandler as default }
